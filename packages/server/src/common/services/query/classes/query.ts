import { 
  QueryElement,
  QueryBase,
  QuerySyntax,
  NodeInterface,
  ExpressionInterface,
  // ExpressionGroupInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  ValueNodeInterface,
  Node,
  // QueryMatchType,
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
    // this.elementList.setMatchingToAll();
    this.nodeFactory.updateLogicalExpressionOperatorToAnd(this.expression);
  }

  setMatchingToAny() {
    // this.elementList.setMatchingToAny();
    this.nodeFactory.updateLogicalExpressionOperatorToOr(this.expression);
  }

  add(element: ExpressionInterface) {
    // this.expression.add(element);
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
    let result = "";
    let elementSQL = "";

    const expressions = this.getExpressions();

    const needsParens = expressions.length > 1;
    const operator = this.getOperator().toString();

    for(let i = 0; i < expressions.length; i++) {
      elementSQL = formatter.process(expressions[i]);

      if (needsParens)
        elementSQL = `(${elementSQL})`;

      if( i > 0 )
        result += ` ${operator} `;

      result += elementSQL;
    }

    return result;
  }
}

