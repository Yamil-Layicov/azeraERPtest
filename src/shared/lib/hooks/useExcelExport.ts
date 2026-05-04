import { useCallback, isValidElement } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import type { Option } from "../../types";

interface ExportOptions<T> {
  data: T[];
  columns: {
    header: ReactNode;
    accessor: string;
    render?: (item: T, index?: number) => ReactNode;
  }[];
  fileName?: string;
  sheetName?: string;
  lookupData?: {
    rootCompaniesOptions?: Option[];
  };
}

const extractText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim();
  }
  if (Array.isArray(node)) {
    const isList = node.some((n) => isValidElement(n) && n.key != null);
    const parts = node
      .map(extractText)
      .filter((t) => t.length > 0);
    
    if (parts.length === 0) return "";
    if (isList) return parts.join(", ");
    
    if (parts.length === 2) return parts.join(": ");
    
    return parts.join(" ");
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode; title?: string };
    
    if (props.title && props.children) {
      const childrenText = extractText(props.children);
      if (childrenText && props.title.trim() !== childrenText.trim()) {
        return `${props.title.trim()}: ${childrenText.trim()}`;
      }
      return childrenText;
    }
    
    return extractText(props.children);
  }
  return "";
};

export const useExcelExport = <T extends object>() => {
  const exportToExcel = useCallback(({
    data,
    columns,
    fileName = "export",
    sheetName = "Sheet1",
    lookupData
  }: ExportOptions<T>) => {
    if (!data || data.length === 0) {
      toast.error("İxrac etmək üçün məlumat yoxdur");
      return;
    }

    try {
      const filteredColumns = columns.filter((col) => {
        const headerText = extractText(col.header);
        return headerText && headerText !== "#" && col.accessor !== "actions";
      });
      const headers = filteredColumns.map((col) => extractText(col.header));

      const rows = data.map((item, rowIndex) => {
        return filteredColumns.map((col) => {
          let value = "";

          if (col.render) {
            const rendered = col.render(item, rowIndex);
            value = extractText(rendered);
            
            if (!value.trim() && col.accessor) {
              value = String((item as Record<string, unknown>)[col.accessor] || "");
            }
          } else {
            value = String((item as Record<string, unknown>)[col.accessor] || "");
          }

          if (col.accessor === "rootCompanyId" && /^[0-9a-f-]{36}$/i.test(String(value)) && lookupData?.rootCompaniesOptions) {
            const company = lookupData.rootCompaniesOptions.find(
              (opt) => String(opt.id) === String(value)
            );
            value = company?.fullName || String(value);
          }

          return String(value || "").trim().replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ") || "-";
        });
      });

      const excelTable = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
          <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          <style>
            table { border-collapse: collapse; }
            th { background-color: #f2f2f2; font-weight: bold; border: 0.5pt solid #000000; }
            td { border: 0.5pt solid #000000; mso-number-format:"\\@"; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([excelTable], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_${new Date().getTime()}.xls`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Excel faylı hazırlandı");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("İxrac zamanı xəta baş verdi");
    }
  }, []);

  return { exportToExcel };
};
