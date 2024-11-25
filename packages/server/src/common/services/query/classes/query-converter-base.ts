import {
  QueryConversionAllowedInputType,
  QuerySyntax,
  QueryElement,
  NodeInterface,
  AttributeNodeInterface,
  EventNodeInterface,
  ValueNodeInterface,
  // ExpressionGroupInterface,
  ExpressionInterface,
  BinaryExpressionInterface,
  LogicalExpressionInterface,
  NodeFactory,
} from "../";

export abstract class QueryConverterBase<T=QueryConversionAllowedInputType> {
  input: any;
  nodeFactory = new NodeFactory();

  constructor(input: any) {
    this.input = input;
  }

  process(node: NodeInterface): any {
    switch(node.kind) {
      case QuerySyntax.AttributeNode:
        return this.processAttributeNode(node as AttributeNodeInterface);
      case QuerySyntax.EventNode:
        return this.processEventNode(node as EventNodeInterface);
      case QuerySyntax.ValueNode:
        return this.processValueNode(node as ValueNodeInterface);
      // case QuerySyntax.UnaryExpression:
      //   return this.processUnaryExpression(node as UnaryExpressionInterface)
      case QuerySyntax.BinaryExpression:
        return this.processBinaryExpression(node as BinaryExpressionInterface)
      // case QuerySyntax.TernaryExpression:
      //   return this.processTernaryExpression(node as TernaryExpressionInterface)
      case QuerySyntax.LogicalExpression:
        return this.processLogicalExpression(node as LogicalExpressionInterface)
      // case QuerySyntax.ExpressionGroup:
      //   return this.processExpressionGroupNode(node as ExpressionGroupInterface);
      // case QuerySyntax.AttributeExpression:
      //   return this.processAttributeExpression(node as ExpressionInterface);
      // case QuerySyntax.EventExpression:
      //   return this.processEventExpression(node as ExpressionInterface);
      case QuerySyntax.EmailExpression:
      case QuerySyntax.MessageExpression:
      case QuerySyntax.SMSExpression:
      case QuerySyntax.PushExpression:
        return;
    }
  }

  abstract processAttributeNode(node: QueryElement);
  abstract processEventNode(node: QueryElement);
  abstract processValueNode(node: QueryElement);
  abstract processBinaryExpression(node: BinaryExpressionInterface);
  abstract processLogicalExpression(node: LogicalExpressionInterface);
  // abstract processExpressionGroupNode(node: QueryElement);
  // abstract processAttributeExpression(node: QueryElement);
  // abstract processEventExpression(node: QueryElement);
} 