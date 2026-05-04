import { Medicine } from "../types/user";
import { api } from "./api";

interface BackendMedicine {
  id: string;
  brand: string;
  generic: string;
  category: string;
  strength: string | null;
  form: string;
  pack_size: string | null;
  requires_prescription: boolean;
  price: {
    mrp: number;
    final_price: number;
    discount_percent: number;
    source: string;
  } | null;
}

function mapMedicine(m: BackendMedicine): Medicine {
  return {
    id: m.id,
    name: m.brand,
    category: m.category,
    dosage: m.strength ?? m.form,
    packSize: m.pack_size ?? "",
    price: m.price ? Number(m.price.final_price) : 0,
    image: "",
  };
}

function extractMedicineList(responseData: unknown): BackendMedicine[] {
  if (Array.isArray(responseData)) return responseData as BackendMedicine[];
  const d = responseData as Record<string, unknown> | null;
  if (d && Array.isArray(d.data)) return d.data as BackendMedicine[];
  return [];
}

export const medicineService = {
  async getMedicines(): Promise<Medicine[]> {
    try {
      const res = await api.get("/medicines", { params: { limit: 50 } });
      return extractMedicineList(res.data).map(mapMedicine);
    } catch (err) {
      console.error("[medicineService.getMedicines]", err);
      return [];
    }
  },

  async searchMedicines(name: string): Promise<Medicine[]> {
    if (name.trim().length < 2) return [];
    try {
      const res = await api.get("/medicines/search", { params: { name } });
      return extractMedicineList(res.data).map((m) => ({
        id: m.brand + m.generic,
        name: m.brand,
        category: m.category ?? m.generic,
        dosage: m.strength ?? m.form,
        packSize: m.pack_size ?? "",
        price: m.price ? Number(m.price.final_price) : 0,
        image: "",
      }));
    } catch (err) {
      console.error("[medicineService.searchMedicines]", err);
      return [];
    }
  },
};
