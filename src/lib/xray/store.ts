import { XraySession } from "./types";


class Store {
    private sessions = new Map<string, XraySession>();

    save(session: XraySession): void {
        this.sessions.set(session.id, session);
    }

    get(id: string): XraySession | undefined {
        return this.sessions.get(id);
    }

    getAll(): XraySession[] {
        return Array.from(this.sessions.values());
    }

    delete(id: string): void {
        this.sessions.delete(id);
    }

    clear(): void {
        this.sessions.clear();
    }



}
export const xrayStore = new Store();

