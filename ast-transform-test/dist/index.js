var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transformFromAstSync } from "@babel/core";
import parse from "@babel/parser";
import template from "@babel/template";
import { isObjectExpression } from "@babel/types";
import prettier from "prettier";
const sourceCode = `
import { Module } from '@nestjs/common';

@Module({})
export class AaaModule {}
`;
function myPlugin() {
    return {
        visitor: {
            Program(path) {
                let index = 0;
                while (path.node.body[index].type === "ImportDeclaration") {
                    index++;
                }
                const ast = template.statement("import {AAAController} from './aaa.controller'")();
                path.node.body.splice(index, 0, ast);
            },
            Decorator(path) {
                const decoratorName = path.node.expression.callee.name;
                if (decoratorName !== "Module") {
                    return;
                }
                const obj = path.node.expression.arguments[0];
                const controllers = obj.properties.find((item) => item.key.name === "controllers");
                if (!controllers) {
                    const expression = template.expression("{controllers: [AaaController]}")();
                    if (isObjectExpression(expression)) {
                        obj.properties.push(expression.properties[0]);
                    }
                }
                else {
                    const property = template.statement("AaaController")();
                    controllers.value.elements.push(property);
                }
            },
        },
    };
}
const ast = parse.parse(sourceCode, {
    sourceType: "module",
    plugins: ["decorators"],
});
const res = transformFromAstSync(ast, sourceCode, {
    plugins: [myPlugin],
    retainLines: true,
});
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const formatedCode = yield prettier.format(res === null || res === void 0 ? void 0 : res.code, {
            filepath: "aaa.ts",
        });
        console.log(formatedCode);
    });
})();
