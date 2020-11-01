import { ProviderName } from "./types";
import { CodeforcesProvider } from "./codeforces";

export function providerCreator(provName: ProviderName) {
    if (provName == "Codeforces") {
        return new CodeforcesProvider();
    }
}

export * from "./types"