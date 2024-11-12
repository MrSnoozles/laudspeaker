import { 
  QueryElement,
  QueryBase,
  QuerySyntax,
  NodeInterface,
  ExpressionInterface,
  ExpressionGroupInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  ValueNodeInterface,
  Node,
  QueryMatchType
} from "../";

export class Query implements QueryBase {
  elements: QueryElement[];
  matching: QueryMatchType;

  constructor() {
    this.elements = [];
    this.setMatchingToAny();
  }

  setMatchingToAll() {
    this.matching = QuerySyntax.MatchingTypeAll;
  }

  setMatchingToAny() {
    this.matching = QuerySyntax.MatchingTypeAny;
  }

  add(element: QueryElement) {
    this.elements.push(element);
  }

  toSQL(): string {
    const formatter = new PGFormatter();
    let result = "";
    let elementSQL = "";

    const needsParens = this.elements.length > 1;
    const matchType = this.matching == QuerySyntax.MatchingTypeAll ? 'AND' : 'OR';

    for(let i = 0; i < this.elements.length; i++) {
      elementSQL = formatter.process(this.elements[i]);

      if (needsParens)
        elementSQL = `(${elementSQL})`;

      if( i > 0 )
        result += ` ${matchType} `;

      result += elementSQL;
    }

    return result;
  }
}

export class QueryFormatterBase {
  // process(express)
}

export class PGFormatter extends QueryFormatterBase {
  process(node: NodeInterface) {
    return this.processNode(node);
  }

  processAttributeExpression(expression: ExpressionInterface) {
    const lhs = this.processNode(expression.left);
    const rhs = this.processNode(expression.right);
    const operatorString = expression.operator.toString();

    const result = `${lhs} ${operatorString} ${rhs}`;

    return result;
  }

  processEventExpression(expression: ExpressionInterface) {
    const lhs = this.processNode(expression.left);
    const rhs = this.processNode(expression.right);
    const operatorString = expression.operator.toString();

    const result = `${lhs} ${operatorString} ${rhs}`;

    switch(expression.operator) {
      case QuerySyntax.HasPerformedKeyword:
        // return this.processAttributeNode(node as AttributeNodeInterface);
      case QuerySyntax.HasNotPerformedKeyword:
        // return this.processEventNode(node as EventNodeInterface);
    }

    return result;
  }

  private processAttributeNode(node: AttributeNodeInterface) {
    let attribute = node.attribute.toString();

    if (node.prefix && node.prefix.length > 0)
      attribute = `${node.prefix.toString()}->>${attribute}`;

    return attribute;
  }

  private processEventNode(node: EventNodeInterface) {
    let event = node.event.toString();

    return event;
  }

  private processValueNode(node: ValueNodeInterface) {
    return node.value.toString();
  }

  private processExpressionGroupNode(node: ExpressionGroupInterface) {
    const formatter = new PGFormatter();
    let result = "";
    let elementSQL = "";

    const needsParens = node.elements.length > 1;
    const matchType = node.matching == QuerySyntax.MatchingTypeAll ? 'AND' : 'OR';

    for(let i = 0; i < node.elements.length; i++) {
      elementSQL = formatter.process(node.elements[i]);

      if (needsParens)
        elementSQL = `(${elementSQL})`;

      if( i > 0 )
        result += ` ${matchType} `;

      result += elementSQL;
    }

    return result;
  }

  private processNode(node: NodeInterface) {
    switch(node.kind) {
      case QuerySyntax.AttributeNode:
        return this.processAttributeNode(node as AttributeNodeInterface);
      case QuerySyntax.EventNode:
        return this.processEventNode(node as EventNodeInterface);
      case QuerySyntax.ValueNode:
        return this.processValueNode(node as ValueNodeInterface);
      case QuerySyntax.ExpressionGroup:
        return this.processExpressionGroupNode(node as ExpressionGroupInterface);
      case QuerySyntax.AttributeExpression:
        return this.processAttributeExpression(node as ExpressionInterface);
      case QuerySyntax.EventExpression:
        return this.processEventExpression(node as ExpressionInterface);
      case QuerySyntax.EmailExpression:
      case QuerySyntax.MessageExpression:
      case QuerySyntax.SMSExpression:
      case QuerySyntax.PushExpression:
        return;
    }
  }
}
