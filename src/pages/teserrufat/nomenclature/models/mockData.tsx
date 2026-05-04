import type { NomenclatureNode } from "../ui/components/tree/NomenclatureTree";

export const MOCK_DATA: NomenclatureNode[] = [
  {
    id: "1",
    name: "Anbar",
    nodeType: 'category',
    isActive: true,
    children: [
      {
        id: "1-1",
        name: "Mal",
        nodeType: 'category',
        isActive: true,
        children: [
          {
            id: "1-1-1",
            name: "Elektronika",
            nodeType: 'category',
            isActive: true,
            children: [
              {
                id: "1-1-1-1",
                name: "Printer",
                nodeType: 'product',
                isActive: true,
              },
              {
                id: "1-1-1-2",
                name: "Komputer",
                nodeType: 'product',
                isActive: true,
              },
            ],
          },
          {
            id: "1-1-2",
            name: "Nəqliyyat",
            nodeType: 'category',
            isActive: true,
            children: [
              {
                id: "1-1-1-1",
                name: "Proqram təminatı şöbəsi",
                nodeType: 'category',
                isActive: true,
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        name: "Xidmət",
        nodeType: 'category',
        isActive: true,
      },
    
    ],
  },
];