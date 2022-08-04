import { State } from "../../index";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { Visitor } from "@babel/core";
import { printWithCondition } from "../print";

const camelCaseImportDeclaration = t.importDeclaration(
  [t.importSpecifier(t.identifier("camelCase"), t.identifier("camelCase"))],
  t.stringLiteral("lodash")
);

// 8: Adds `import { camelCase } from "lodash"` to the top of the imports
export const addCamelCaseImportVisitors: Visitor<State> = {
  ImportDeclaration: (path: NodePath<t.ImportDeclaration>, state: State) => {
    if (state.camelCaseImported) {
      path.skip();
      return;
    }

    const newPaths = path.insertBefore(camelCaseImportDeclaration);
    newPaths.forEach(p => p.skip());
    state.camelCaseImported = true;
    printWithCondition(false, "=== addCamelCaseImport, new camelCase import inserted");
  }
};