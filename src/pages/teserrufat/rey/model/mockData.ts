import type { ReviewRequest } from "./types";

export const mockReviewRequests: ReviewRequest[] = [
  {
    id: "rev-1",
    prNo: "PR-2026-0042",
    requester: "Əli Həsənov",
    department: "İT",
    description:
      "HP 30A Kartuş anbarda mövcud deyil. Satınalma üçün İT şöbəsinin rəyi tələb olunur.",
    rejectedDate: "2026-03-05",
    products: [{ id: "p1", name: "HP 30A Kartuş", requestedQty: 2 }],
    status: "pending",
    rejectedFrom: "Anbar",
    note: "Anbarda stok bitib, son 3 ayda 5 ədəd istifadə olunub.",
  },
  {
    id: "rev-2",
    prNo: "PR-2026-0038",
    requester: "Leyla Məmmədova",
    department: "Maliyyə",
    description:
      "Canon skaner anbarda yoxdur. Satınalma üçün Maliyyə şöbəsinin təsdiqi gözlənilir.",
    rejectedDate: "2026-03-04",
    products: [{ id: "p2", name: "Canon CanoScan LiDE 400", requestedQty: 1 }],
    status: "pending",
    rejectedFrom: "Anbar",
  },
  {
    id: "rev-3",
    prNo: "PR-2026-0035",
    requester: "Kamran Əliyev",
    department: "İT",
    description:
      "Dell monitor sifariş edilib, anbarda yoxdur. İT şöbəsinin rəyi lazımdır.",
    rejectedDate: "2026-03-03",
    products: [
      { id: "p3", name: "Dell P2422H Monitor", requestedQty: 3 },
      { id: "p4", name: "HDMI Kabel 2m", requestedQty: 3 },
    ],
    status: "approved",
    rejectedFrom: "Anbar",
    note: "İT şöbəsi təsdiqlədikdən sonra satınalmaya yönləndirildi.",
  },
  {
    id: "rev-4",
    prNo: "PR-2026-0030",
    requester: "Nigar Həsənli",
    department: "HR",
    description:
      "Ergonomik kreslo anbarda mövcud deyil. HR şöbəsinin rəyi gözlənilir.",
    rejectedDate: "2026-03-02",
    products: [{ id: "p5", name: "Ergonomik Ofis Kreslosu", requestedQty: 5 }],
    status: "rejected",
    rejectedFrom: "Anbar",
    note: "Büdcə kifayət etmir, gələn rüb üçün planlaşdırılsın.",
  },
];
