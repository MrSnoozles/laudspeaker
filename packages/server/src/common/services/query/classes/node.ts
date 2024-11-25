import {
  NodeInterface,
  // NodeListInterface,
  QuerySyntax,
  // QueryMatchType,
} from "../";

export class Node<T extends QuerySyntax> implements NodeInterface {
  public kind: T;
  public parent: NodeInterface;

  constructor(kind: T, parent?: NodeInterface) {
    this.kind = kind;
    this.parent = undefined!;
  }
}

// export class NodeList extends Node<QuerySyntax.NodeList> implements NodeListInterface {
//   public nodes: NodeInterface[];
//   public operator: QueryMatchType;

//   constructor() {
//     super(QuerySyntax.NodeList);

//     this.expressions = [];
//     this.setMatchingToAny();
//   }

//   add(node: NodeInterface) {
//     this.expressions.push(node);
//   }
  
//   setMatchingToAll() {
//     this.matchType = QuerySyntax.MatchingTypeAll;
//   }

//   setMatchingToAny() {
//     this.matchType = QuerySyntax.MatchingTypeAny;
//   }

//   getLength(): number {
//     return this.expressions.length;
//   }

//   getMatchType(): QueryMatchType {
//     return this.matchType;
//   }
// }