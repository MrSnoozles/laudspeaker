import { 
  QueryElement,
  QueryBase,
  QuerySyntax,
  NodeInterface,
  ExpressionInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  // EventExpressionInterface,
  ValueNodeInterface,
  OperatorKind,
  EventOperatorKind,
  Node,
  UnaryExpressionInterface,
  BinaryExpressionInterface,
  TernaryExpressionInterface,
  LogicalExpressionInterface,
} from "../";

export class NodeFactory {

  createBaseNode<T extends NodeInterface>(kind: T["kind"]) {
    const node = new Node(kind);
    return node as T;
  }

  createUnaryExpression() {
    const node = this.createBaseNode<UnaryExpressionInterface>(QuerySyntax.UnaryExpression);

    return node;
  }

  createBinaryExpression() {
    const node = this.createBaseNode<BinaryExpressionInterface>(QuerySyntax.BinaryExpression);

    return node;
  }

  // createBinaryExpression(
  //   attribute: string,
  //   operator: OperatorKind,
  //   value: any,
  //   parent?: NodeInterface) {

  //   const exp = this.createAttributeExpressionNode(
  //     attribute,
  //     operator,
  //     value,
  //     parent);

  //   return exp;
  // }

  createTernaryExpression() {
    const node = this.createBaseNode<TernaryExpressionInterface>(QuerySyntax.TernaryExpression);

    return node;
  }

  createLogicalExpression() {
    const node = this.createBaseNode<LogicalExpressionInterface>(QuerySyntax.LogicalExpression);
    node.operator = QuerySyntax.AndKeyword;
    node.expressions = [];

    return node;
  }

  addExpressionToLogicalExpression(
    logicalExpression: LogicalExpressionInterface,
    expression: ExpressionInterface) {
    logicalExpression.expressions.push(expression);
  }

  updateLogicalExpressionOperatorToAnd(
    logicalExpression: LogicalExpressionInterface) {
    logicalExpression.operator = QuerySyntax.AndKeyword;
  }

  updateLogicalExpressionOperatorToOr(
    logicalExpression: LogicalExpressionInterface) {
    logicalExpression.operator = QuerySyntax.OrKeyword;
  }

  createAttributeExpressionNode(
    attribute: string,
    operator: OperatorKind,
    value: any,
    parent?: NodeInterface) {

    const node = this.createBinaryExpression();
    const nodeLHS = this.createAttributeNode(attribute);
    const nodeRHS = this.createValueNode(value);

    node.operator = operator;
    node.left = nodeLHS;
    node.right = nodeRHS;

    return node;
  }

  createEventExpressionNode(
    event: string,
    operator: OperatorKind,
    value: any,
    attributes?: ExpressionInterface[],
    parent?: NodeInterface) {
    // const node = this.createBaseNode<EventExpressionInterface>(QuerySyntax.EventExpression);
    const node = this.createBinaryExpression();

    const nodeLHS = this.createEventNode(event);
    const nodeRHS = this.createValueNode(value);
    node.operator = operator;
    node.left = nodeLHS;
    node.right = nodeRHS;

    return node;
  }

  createAttributeNode(attribute: string) {
    const node = this.createBaseNode<AttributeNodeInterface>(QuerySyntax.AttributeNode);
    node.attribute = attribute;
    node.prefix = "payload";
    
    return node;
  }

  createEventNode(event: string) {
    const node = this.createBaseNode<EventNodeInterface>(QuerySyntax.EventNode);
    node.event = event;
    node.prefix = "payload";
    
    return node;
  }

  createValueNode(value: any) {
    const node = this.createBaseNode<ValueNodeInterface>(QuerySyntax.ValueNode);
    node.value = value;

    return node;
  }




  // BinaryExpressionForCustomerPayload
  // BinaryExpressionForEvents;

  // events.attributes('credit_score')
}

