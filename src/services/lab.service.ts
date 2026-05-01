import { LabReport, LabTest } from "../types/user";
import { LAB_REPORTS, LAB_TESTS } from "../utils/constants";
import { delay } from "../utils/helpers";

export const labService = {
  async getTests(): Promise<LabTest[]> {
    await delay(450);
    return LAB_TESTS;
  },
  async getReports(): Promise<LabReport[]> {
    await delay(450);
    return LAB_REPORTS;
  },
};
