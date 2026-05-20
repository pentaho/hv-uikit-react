import { escape, table } from "arquero";

import type { HvChartFilter } from "../types";
import { getHvArqueroCombinedFilters } from "./index";

const data = {
  Country: ["Portugal", "USA", "India", "China", "France", "UK", "Japan"],
  Sales: [3600, 1500, 6700, 4500, 3200, 2700, 2700],
};

const processFilters = (filters: HvChartFilter[]) => {
  let tableData = table(data);
  tableData = tableData.filter(
    escape((row: any) => getHvArqueroCombinedFilters(row, filters)),
  );
  return tableData;
};

describe("getHvArqueroCombinedFilters", () => {
  it("should return correct country when IS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "is",
        value: "France",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["France"]);
  });

  it("should return correct countries when IS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "is",
        value: ["France", "Portugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal", "France"]);
  });

  it("should return all countries when IS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "is",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when IS NOT filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "isNot",
        value: "France",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when IS NOT filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "isNot",
        value: ["France", "Portugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["USA", "India", "China", "UK", "Japan"]);
  });

  it("should return all countries when IS NOT filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "isNot",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when CONTAINS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "contains",
        value: "tugal",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal"]);
  });

  it("should return correct countries when CONTAINS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "contains",
        value: ["ance", "tugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal", "France"]);
  });

  it("should return all countries when CONTAINS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "contains",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when NOT CONTAINS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notContains",
        value: "tugal",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when NOT CONTAINS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notContains",
        value: ["ance", "tugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["USA", "India", "China", "UK", "Japan"]);
  });

  it("should return all countries when NOT CONTAINS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notContains",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when GREATER THAN filter is a number", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThan",
        value: 4500,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["India"]);
  });

  it("should return correct countries when GREATER THAN filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThan",
        value: [4000, 6000],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["India", "China"]);
  });

  it("should return all countries when GREATER THAN filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThan",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when GREATER THAN OR EQUAL filter is a number", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThanOrEqual",
        value: 4500,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["India", "China"]);
  });

  it("should return correct countries when GREATER THAN OR EQUAL filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThanOrEqual",
        value: [4500, 6000],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["India", "China"]);
  });

  it("should return all countries when GREATER THAN OR EQUAL filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "greaterThanOrEqual",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when LESS THAN filter is a number", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThan",
        value: 4500,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal", "USA", "France", "UK", "Japan"]);
  });

  it("should return correct countries when LESS THAN filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThan",
        value: [4000, 6000],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return all countries when LESS THAN filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThan",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when LESS THAN OR EQUAL filter is a number", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThanOrEqual",
        value: 4500,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when LESS THAN OR EQUAL filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThanOrEqual",
        value: [4000, 6000],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return all countries when LESS THAN OR EQUAL filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "lessThanOrEqual",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return empty when BETWEEN filter is a number", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "between",
        value: 4500,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([]);
  });

  it("should return correct countries when BETWEEN filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "between",
        value: [4000, 6000],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["China"]);
  });

  it("should return all countries when BETWEEN filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Sales",
        operation: "between",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when ENDS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "ends",
        value: "tugal",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal"]);
  });

  it("should return correct countries when ENDS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "ends",
        value: ["ance", "tugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal", "France"]);
  });

  it("should return all countries when ENDS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "ends",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when NOT ENDS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notEnds",
        value: "tugal",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when NOT ENDS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notEnds",
        value: ["ance", "tugal"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["USA", "India", "China", "UK", "Japan"]);
  });

  it("should return all countries when NOT ENDS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notEnds",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when STARTS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "starts",
        value: "Port",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal"]);
  });

  it("should return correct countries when STARTS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "starts",
        value: ["Fran", "Port"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["Portugal", "France"]);
  });

  it("should return all countries when STARTS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "starts",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct country when NOT STARTS filter is a string", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notStarts",
        value: "Port",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when NOT STARTS filter has an array of elements", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notStarts",
        value: ["Fran", "Port"],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual(["USA", "India", "China", "UK", "Japan"]);
  });

  it("should return all countries when NOT STARTS filter has an empty array", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "notStarts",
        value: [],
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });

  it("should return correct countries when combining filters", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "contains",
        value: ["a", "A"],
      },
      {
        field: "Sales",
        operation: "greaterThan",
        value: 2000,
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "India",
      "China",
      "France",
      "Japan",
    ]);
  });

  it("should return empty when combining two IS filters", () => {
    const tableData = processFilters([
      {
        field: "Country",
        operation: "is",
        value: "Portugal",
      },
      {
        field: "Country",
        operation: "is",
        value: "France",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([]);
  });

  it("should not apply filter if the field is not present in the dataset", () => {
    const tableData = processFilters([
      {
        field: "MissingField",
        operation: "contains",
        value: "someString",
      },
    ]);
    const countries = tableData.array("Country");
    expect(countries).toEqual([
      "Portugal",
      "USA",
      "India",
      "China",
      "France",
      "UK",
      "Japan",
    ]);
  });
});
