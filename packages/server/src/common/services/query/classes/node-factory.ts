import { 
  QueryElement,
  QueryBase,
  QuerySyntax,
  NodeInterface,
  ExpressionInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  EventExpressionInterface,
  ValueNodeInterface,
  OperatorKind,
  EventOperatorKind,
  Node,
} from "../";

export class NodeFactory {

  createBaseNode<T extends NodeInterface>(kind: T["kind"]) {
    const node = new Node(kind);
    return node as T;
    // return baseFactory.createBaseNode(kind) as Mutable<T>;
  }

  createAttributeExpressionNode(
    attribute: string,
    operator: OperatorKind,
    value: any,
    parent?: NodeInterface) {
    const node = this.createBaseNode<ExpressionInterface>(QuerySyntax.AttributeExpression);

    const nodeLHS = this.createAttributeNode(attribute);
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

  createEventExpressionNode(
    event: string,
    operator: EventOperatorKind,
    value: any,
    attributes?: ExpressionInterface[],
    parent?: NodeInterface) {
    const node = this.createBaseNode<EventExpressionInterface>(QuerySyntax.EventExpression);

    const nodeLHS = this.createEventNode(event);
    const nodeRHS = this.createValueNode(value);
    node.operator = operator;
    node.left = nodeLHS;
    node.right = nodeRHS;

    return node;
  }

  createBinaryExpression(
    attribute: string,
    operator: OperatorKind,
    value: any,
    parent?: NodeInterface) {

    const exp = this.createAttributeExpressionNode(
      attribute,
      operator,
      value,
      parent);

    return exp;
  }

  // BinaryExpressionForCustomerPayload
  // BinaryExpressionForEvents;

  // events.attributes('credit_score')
}

