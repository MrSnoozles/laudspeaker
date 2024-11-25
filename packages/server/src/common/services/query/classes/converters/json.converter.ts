import { QueryConverterBase } from "../";
import {
  Query,
  QuerySyntax,
  QueryElement,
  NodeInterface,
  ExpressionInterface,
  BinaryExpressionInterface,
  LogicalExpressionInterface,
  OperatorKind,
} from "../../";

export class JSONConverter extends QueryConverterBase {

  toQuery() {
    const logicalExpression = this.processStatement(this.input.inclusionCriteria.query);

    const query = this.queryFromExpression(logicalExpression);

    return query;
  }

  processStatement(statement: any) {
    switch(statement.type) {
      case "all":
      case "any":
        return this.toLogicalExpression(statement);
      case "Attribute":
      case "Event":
        return this.toBinaryExpression(statement);
    }
  }

  toLogicalExpression(statement: any) {
    const node = this.nodeFactory.createLogicalExpression();

    switch(statement.type) {
      case "all":
        this.nodeFactory.updateLogicalExpressionOperatorToAnd(node);
        break;
      case "any":
        this.nodeFactory.updateLogicalExpressionOperatorToOr(node);
        break;
    }

    for(let subStatement of statement.statements) {
      let exp = this.processStatement(subStatement);

      this.nodeFactory.addExpressionToLogicalExpression(node, exp);
    }

    return node;
  }

  toBinaryExpression(statement: any) {
    const operator = this.getOperatorKindFromString(statement.comparisonType);
    switch(statement.type) {
      case "Attribute":
        return this.nodeFactory.createAttributeExpressionNode(
          statement.key,
          operator,
          statement.value
        );
      case "Event":
        return this.nodeFactory.createEventExpressionNode(
          statement.key,
          operator,
          statement.value
        );
    }
  }

  getOperatorKindFromString(operatorStr): OperatorKind {
    switch(operatorStr) {
      case "is equal to":
        return QuerySyntax.EqualsToken;
    }
  }

  queryFromLogicalExpression(node: LogicalExpressionInterface) {
    const query = new Query();

    if (node.operator == QuerySyntax.AndKeyword)
      query.setMatchingToAll();
    else
      query.setMatchingToAny();

    for(let expression of node.expressions)
      query.add(expression);

    return query;
  }

  queryFromExpression(node: ExpressionInterface) {
    switch(node.kind) {
      case QuerySyntax.LogicalExpression:
        return this.queryFromLogicalExpression(node as LogicalExpressionInterface);
    }
  }

  processBinaryExpression(node: BinaryExpressionInterface) {

  }

  processLogicalExpression(node: LogicalExpressionInterface) {

  }

  // processAttributeExpression(node: QueryElement) {

  // }

  // processEventExpression(node: QueryElement) {

  // }

  processAttributeNode(node: QueryElement) {

  }

  processEventNode(node: QueryElement) {

  }

  processValueNode(node: QueryElement) {

  }

  processExpressionGroupNode(node: QueryElement) {

  }

  
  
}
