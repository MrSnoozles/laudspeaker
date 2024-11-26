import { 
  QueryElement,
  QueryBase,
  QuerySyntax,
  NodeInterface,
  ExpressionInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  ValueNodeInterface,
  Node,
  PGFormatter,
  LogicalExpressionInterface,
  NodeFactory,
} from "../";

export class Query implements QueryBase {
  expression: LogicalExpressionInterface;
  private nodeFactory = new NodeFactory();

  constructor() {
    this.expression = this.nodeFactory.createLogicalExpression();
  }

  static fromJSON(jsonObj: Record<string, string>): Query {
    return new Query();
  }

  setMatchingToAll() {
    this.nodeFactory.updateLogicalExpressionOperatorToAnd(this.expression);
  }

  setMatchingToAny() {
    this.nodeFactory.updateLogicalExpressionOperatorToOr(this.expression);
  }

  add(element: ExpressionInterface) {
    this.nodeFactory.addExpressionToLogicalExpression(this.expression, element);
  }

  getExpressions(): ExpressionInterface[] {
    return this.expression.expressions;
  }

  getOperator() {
    return this.expression.operator;
  }

  toSQL(): string {
    const formatter = new PGFormatter();

    return formatter.process(this.expression);
  }
}

