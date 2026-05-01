import { Medicine } from "../types/user";
import { MEDICINES } from "../utils/constants";
import { delay } from "../utils/helpers";

export const medicineService = {
  async getMedicines(): Promise<Medicine[]> {
    await delay(500);
    return MEDICINES;
  },
};
