import {
  NodeInterface,
  ExpressionInterface,
  QuerySyntax,
  OperatorKind,
  ExpressionKind
} from "../";

export class Node<T extends QuerySyntax> implements NodeInterface {
  public kind: T;
  public parent: NodeInterface;

  constructor(kind: T, parent?: NodeInterface) {
    this.kind = kind;
    this.parent = undefined!;
  }
}

// export class Expression<T extends QuerySyntax> extends Node<T> implements ExpressionInterface {
//   operator: OperatorKind;
//   left: ExpressionInterface;
//   right: ExpressionInterface;

//   constructor(kind: T, operator: OperatorKind, parent?: NodeInterface) {
//     super(kind, parent);

//     this.operator = operator;
//   }
// }

// export class AttributeExpression<T extends QuerySyntax.AttributeExpression> extends Expression<T> {
//   constructor(kind: T, operator: OperatorKind, parent?: NodeInterface) {
//     super(kind, operator, parent);
//   }
// }
