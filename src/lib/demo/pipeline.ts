import {
  createSession,
  runStep,
  setReasoning,
  addEvaluation,
  completeSession,
  XraySession,
} from "../xray";
import { Product, referenceProduct, candidateProducts, mockKeywords } from "./mock-data";


const PRICE_RANGE_MULTIPLIER = { min: 0.5, max: 2.0 };
const MIN_RATING = 3.8;
const MIN_REVIEWS = 100;

export async function runCompetitorSelectionPipeline(): Promise<XraySession> {
  const session = createSession("competitor-selection", {
    referenceProduct: referenceProduct.asin,
    referenceTitle: referenceProduct.title,
  });

  try {

    const keywordResult = await runStep(
      session,
      "keyword-generation",
      "llm",
      { title: referenceProduct.title, category: referenceProduct.category },
      async (step) => {
        await delay(100);

        setReasoning(
          step,
          `Generated ${mockKeywords.length} keywords from product title and category. ` +
          `Extracted key attributes: material (stainless steel), capacity (32oz), feature (insulated).`
        );

        return {
          keywords: mockKeywords,
          model: "gpt-4",
        };
      }
    );


    const searchResult = await runStep(
      session,
      "candidate-search",
      "search",
      { keywords: keywordResult.keywords, limit: 50 },
      async (step) => {
        await delay(50);

        setReasoning(
          step,
          `Searched for "${keywordResult.keywords[0]}" and retrieved ${candidateProducts.length} candidates. ` +
          `In production, this would query an API returning thousands of results.`
        );

        return {
          totalResults: 2847,
          candidatesFetched: candidateProducts.length,
          candidates: candidateProducts,
        };
      }
    );

    const priceMin = referenceProduct.price * PRICE_RANGE_MULTIPLIER.min;
    const priceMax = referenceProduct.price * PRICE_RANGE_MULTIPLIER.max;

    const filterResult = await runStep(
      session,
      "apply-filters",
      "filter",
      {
        candidatesCount: searchResult.candidates.length,
        referenceProduct: {
          asin: referenceProduct.asin,
          title: referenceProduct.title,
          price: referenceProduct.price,
        },
        filters: {
          priceRange: { min: priceMin, max: priceMax },
          minRating: MIN_RATING,
          minReviews: MIN_REVIEWS,
        },
      },
      async (step) => {
        const passedCandidates: Product[] = [];

        for (const product of searchResult.candidates) {
          const priceInRange = product.price >= priceMin && product.price <= priceMax;
          const ratingOk = product.rating >= MIN_RATING;
          const reviewsOk = product.reviews >= MIN_REVIEWS;
          const allPassed = priceInRange && ratingOk && reviewsOk;

          addEvaluation(step, {
            id: product.asin,
            label: product.title,
            passed: allPassed,
            criteria: [
              {
                name: "price_range",
                passed: priceInRange,
                expected: `$${priceMin.toFixed(2)} - $${priceMax.toFixed(2)}`,
                actual: `$${product.price.toFixed(2)}`,
                detail: priceInRange
                  ? `$${product.price.toFixed(2)} is within range`
                  : `$${product.price.toFixed(2)} is ${product.price < priceMin ? "below minimum" : "above maximum"}`,
              },
              {
                name: "min_rating",
                passed: ratingOk,
                expected: `≥ ${MIN_RATING}★`,
                actual: `${product.rating}★`,
                detail: ratingOk
                  ? `${product.rating}★ meets threshold`
                  : `${product.rating}★ below ${MIN_RATING}★ threshold`,
              },
              {
                name: "min_reviews",
                passed: reviewsOk,
                expected: `≥ ${MIN_REVIEWS}`,
                actual: `${product.reviews}`,
                detail: reviewsOk
                  ? `${product.reviews} reviews meets threshold`
                  : `${product.reviews} reviews below ${MIN_REVIEWS} minimum`,
              },
            ],
          });

          if (allPassed) {
            passedCandidates.push(product);
          }
        }

        setReasoning(
          step,
          `Applied price, rating, and review filters. ` +
          `${passedCandidates.length} of ${searchResult.candidates.length} candidates passed all criteria.`
        );

        return {
          totalEvaluated: searchResult.candidates.length,
          passed: passedCandidates.length,
          failed: searchResult.candidates.length - passedCandidates.length,
          qualifiedCandidates: passedCandidates,
        };
      }
    );

    const relevanceResult = await runStep(
      session,
      "llm-relevance-evaluation",
      "llm",
      {
        candidatesCount: filterResult.qualifiedCandidates.length,
        referenceProduct: {
          asin: referenceProduct.asin,
          title: referenceProduct.title,
          category: referenceProduct.category,
        },
        model: "gpt-5.2",
      },
      async (step) => {
        await delay(80);

        const confirmedCompetitors: Product[] = [];
        const falsePositives: Product[] = [];

        for (const product of filterResult.qualifiedCandidates) {
          const isFalsePositive =
            product.category === "Accessories" ||
            product.category === "Kitchen" ||
            product.title.toLowerCase().includes("lid") ||
            product.title.toLowerCase().includes("brush") ||
            product.title.toLowerCase().includes("bag") ||
            product.title.toLowerCase().includes("carrier");

          const isCompetitor = !isFalsePositive;
          const confidence = isCompetitor ? 0.85 + Math.random() * 0.1 : 0.9 + Math.random() * 0.08;

          addEvaluation(step, {
            id: product.asin,
            label: product.title,
            passed: isCompetitor,
            criteria: [
              {
                name: "is_same_product_type",
                passed: isCompetitor,
                expected: "Water bottle (not accessory)",
                actual: isFalsePositive ? "Accessory/Related item" : "Water bottle",
                detail: isCompetitor
                  ? `Confirmed as direct competitor (confidence: ${(confidence * 100).toFixed(0)}%)`
                  : `Identified as false positive: ${product.category} item, not a water bottle`,
              },
            ],
          });

          if (isCompetitor) {
            confirmedCompetitors.push(product);
          } else {
            falsePositives.push(product);
          }
        }

        setReasoning(
          step,
          `LLM evaluated ${filterResult.qualifiedCandidates.length} candidates for relevance. ` +
          `Confirmed ${confirmedCompetitors.length} as true competitors, ` +
          `removed ${falsePositives.length} false positives (accessories, replacement parts, etc.).`
        );

        return {
          totalEvaluated: filterResult.qualifiedCandidates.length,
          confirmedCompetitors: confirmedCompetitors.length,
          falsePositivesRemoved: falsePositives.length,
          candidates: confirmedCompetitors,
        };
      }
    );

    const rankResult = await runStep(
      session,
      "rank-and-select",
      "rank",
      {
        candidatesCount: relevanceResult.candidates.length,
        referenceProduct: {
          asin: referenceProduct.asin,
          title: referenceProduct.title,
          price: referenceProduct.price,
          rating: referenceProduct.rating,
          reviews: referenceProduct.reviews,
        },
        rankingCriteria: {
          primary: "review_count",
          secondary: "rating",
          tertiary: "price_proximity",
        },
      },
      async (step) => {
        await delay(50);

        const scoredCandidates = relevanceResult.candidates.map((product) => {
          const reviewScore = Math.min(product.reviews / 10000, 1);
          const ratingScore = (product.rating - 3.8) / (5.0 - 3.8);

          const priceDiff = Math.abs(product.price - referenceProduct.price);
          const priceProximityScore = Math.max(0, 1 - priceDiff / referenceProduct.price);

          const totalScore = reviewScore * 0.5 + ratingScore * 0.3 + priceProximityScore * 0.2;

          return {
            product,
            scores: {
              reviewScore: Number(reviewScore.toFixed(2)),
              ratingScore: Number(ratingScore.toFixed(2)),
              priceProximityScore: Number(priceProximityScore.toFixed(2)),
              totalScore: Number(totalScore.toFixed(2)),
            },
          };
        });

        scoredCandidates.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

        scoredCandidates.forEach((item, index) => {
          addEvaluation(step, {
            id: item.product.asin,
            label: `#${index + 1}: ${item.product.title}`,
            passed: index === 0, // Only winner "passes"
            criteria: [
              {
                name: "review_count_score",
                passed: true,
                expected: "High review count",
                actual: `${item.product.reviews} reviews`,
                detail: `Score: ${item.scores.reviewScore} (weight: 50%)`,
              },
              {
                name: "rating_score",
                passed: true,
                expected: "High rating",
                actual: `${item.product.rating}★`,
                detail: `Score: ${item.scores.ratingScore} (weight: 30%)`,
              },
              {
                name: "price_proximity_score",
                passed: true,
                expected: "Close to reference price",
                actual: `$${item.product.price.toFixed(2)}`,
                detail: `Score: ${item.scores.priceProximityScore} (weight: 20%)`,
              },
            ],
          });
        });

        const winner = scoredCandidates[0];

        setReasoning(
          step,
          `Ranked ${scoredCandidates.length} competitors using weighted scoring: ` +
          `review count (50%), rating (30%), price proximity (20%). ` +
          `Selected "${winner.product.title}" as best match with score ${winner.scores.totalScore}.`
        );

        return {
          totalRanked: scoredCandidates.length,
          rankedCandidates: scoredCandidates.map((item, index) => ({
            rank: index + 1,
            ...item.product,
            ...item.scores,
          })),
          selectedCompetitor: {
            ...winner.product,
            totalScore: winner.scores.totalScore,
            reason: `Highest overall score (${winner.scores.totalScore}) - ${winner.product.reviews.toLocaleString()} reviews, ${winner.product.rating}★ rating`,
          },
        };
      }
    );

    completeSession(session);
    return session;
  } catch (error) {
    session.status = "failed";
    session.metadata.error = error instanceof Error ? error.message : String(error);
    return session;
  }
}

export const Pipeline_demo = runCompetitorSelectionPipeline;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}