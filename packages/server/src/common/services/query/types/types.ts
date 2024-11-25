export enum QuerySyntax {
  AndKeyword                        = 'AND',
  OrKeyword                         = 'OR',
  NotKeyword                        = 'NOT',
  TrueKeyword                       = 'TRUE',
  FalseKeyword                      = 'FALSE',
  NullKeyword                       = 'NULL',
   
  IsKeyword                         = 'IS',
  InKeyword                         = 'IN',
  AsKeyword                         = 'AS',

  SelectKeyword                     = 'SELECT',
  FromKeyword                       = 'FROM',
  WhereKeyword                      = 'WHERE',
  LikeKeyword                       = 'LIKE',
  BetweenKeyword                    = 'BETWEEN',
  OrderByKeyword                    = 'ORDER BY',
  GroupByKeyword                    = 'GROUP BY',

  OpenParenToken                    = '(',
  CloseParenToken                   = ')',
  DotToken                          = '.',
  BacktickToken                     = '`',
  CommaToken                        = ',',
  ColonToken                        = ':',

  PlusToken                         = '+',
  MinusToken                        = '-',
  AsteriskToken                     = '*',
  SlashToken                        = '/',
  PercentToken                      = '%',

  AmpersandToken                    = '&',
  AmpersandAmpersandToken           = '&&',
  BarToken                          = '|',
  BarBarToken                       = '||',

  LessThanGreaterThanToken          = '<>',
  EqualsToken                       = '=',
  EqualsEqualsToken                 = '==',
  LessThanToken                     = '<',
  LessThanEqualsToken               = '<=',
  GreaterThanToken                  = '>',
  GreaterThanEqualsToken            = '>=',

  MinusGreaterThanGreaterThanToken  = '->>',
  MinusMinusGreaterThanToken        = '-->',

  HasPerformedKeyword               = 'HasPerformedKeyword',
  HasNotPerformedKeyword            = 'HasNotPerformedKeyword',

  MatchingTypeAll                   = 'MatchingTypeAll',
  MatchingTypeAny                   = 'MatchingTypeAny',

  Node                              = 'Node',
  NodeList                          = 'NodeList',

  UnaryExpression                   = 'UnaryExpression',
  BinaryExpression                  = 'BinaryExpression',
  TernaryExpression                 = 'TernaryExpression',
  LogicalExpression                 = 'LogicalExpression',
  MultiaryExpression                = 'MultiaryExpression',

  AttributeExpression               = 'AttributeExpression',
  EventExpression                   = 'EventExpression',
  EmailExpression                   = 'EmailExpression',
  MessageExpression                 = 'MessageExpression',
  SMSExpression                     = 'SMSExpression',
  PushExpression                    = 'PushExpression',
  SegmentExpression                 = 'SegmentExpression',

  AttributeNode                     = 'AttributeNode',
  EventNode                         = 'EventNode',
  ValueNode                         = 'ValueNode',
}

// export NodeKind =
//   | QuerySyntax.Node
//   | QuerySyntax.NodeList
//   | ExpressionKind
//   | ddd;

export type OperatorKind =
  | QuerySyntax.AndKeyword
  | QuerySyntax.OrKeyword
  | QuerySyntax.NotKeyword
  | QuerySyntax.IsKeyword
  | QuerySyntax.InKeyword
  | QuerySyntax.LikeKeyword
  | QuerySyntax.BetweenKeyword
  | QuerySyntax.PlusToken
  | QuerySyntax.MinusToken
  | QuerySyntax.AsteriskToken
  | QuerySyntax.SlashToken
  | QuerySyntax.PercentToken
  | QuerySyntax.AmpersandToken
  | QuerySyntax.AmpersandAmpersandToken
  | QuerySyntax.BarToken
  | QuerySyntax.BarBarToken
  | QuerySyntax.LessThanGreaterThanToken
  | QuerySyntax.EqualsToken
  | QuerySyntax.EqualsEqualsToken
  | QuerySyntax.LessThanToken
  | QuerySyntax.LessThanEqualsToken
  | QuerySyntax.GreaterThanToken
  | QuerySyntax.GreaterThanEqualsToken
  | QuerySyntax.HasPerformedKeyword
  | QuerySyntax.HasNotPerformedKeyword;

export type EventOperatorKind = 
  | QuerySyntax.HasPerformedKeyword
  | QuerySyntax.HasNotPerformedKeyword;

export type ExpressionKind = 
  | QuerySyntax.UnaryExpression
  | QuerySyntax.BinaryExpression
  | QuerySyntax.TernaryExpression
  | QuerySyntax.LogicalExpression
  | QuerySyntax.MultiaryExpression;
  // | QuerySyntax.AttributeExpression
  // | QuerySyntax.EventExpression
  // | QuerySyntax.EmailExpression
  // | QuerySyntax.MessageExpression
  // | QuerySyntax.SMSExpression
  // | QuerySyntax.PushExpression
  // | QuerySyntax.SegmentExpression;

export type LogicalExpressionKind = 
  | QuerySyntax.AndKeyword
  | QuerySyntax.OrKeyword;

export type NodeListOperatorKind = 
  | QuerySyntax.AndKeyword
  | QuerySyntax.OrKeyword;

export interface NodeInterface {
  readonly kind: QuerySyntax;
  readonly parent?: NodeInterface;
}

export interface ExpressionInterface extends NodeInterface {
  kind: ExpressionKind;
  operator: OperatorKind;
}

// export interface NodeListInterface extends NodeInterface {
//   kind: QuerySyntax.NodeList;
//   nodes: NodeInterface[];
//   operator: NodeListOperatorKind;

//   add(node: NodeInterface);
//   setMatchingToAll();
//   setMatchingToAny();
//   getLength(): number;
// }

export interface UnaryExpressionInterface extends ExpressionInterface {
  kind: QuerySyntax.UnaryExpression;
  left: NodeInterface;
}

export interface BinaryExpressionInterface extends ExpressionInterface {
  kind: QuerySyntax.BinaryExpression;
  left: NodeInterface;
  right: NodeInterface;
}

export interface TernaryExpressionInterface {
  kind: QuerySyntax.TernaryExpression;
  left: NodeInterface;
  middle: NodeInterface;
  right: NodeInterface;
}

export interface LogicalExpressionInterface {
  kind: QuerySyntax.LogicalExpression;
  operator: LogicalExpressionKind;
  expressions: ExpressionInterface[];

  add(node: ExpressionInterface);
  getLength(): number;
  setMatchingToAll();
  setMatchingToAny();
}

// export interface MultiaryExpressionInterface {
//   kind: QuerySyntax.MultiaryExpression;
//   expressions: ExpressionInterface[];
// }

// export interface EventExpressionInterface extends ExpressionInterface {
//   kind: QuerySyntax.EventExpression;
//   operator: EventOperatorKind;
//   event: string;
//   attributeExpressions?: ExpressionInterface[]
// }

// Nodes for variables
export interface AttributeNodeInterface extends NodeInterface {
  kind: QuerySyntax.AttributeNode;
  attribute: string;
  prefix?: string;
}

export interface EventNodeInterface extends NodeInterface {
  kind: QuerySyntax.EventNode;
  event: string;
  prefix?: string;
}

export interface ValueNodeInterface extends NodeInterface {
  kind: QuerySyntax.ValueNode;
  value: any;
}

export interface QueryBase {
  expression: LogicalExpressionInterface;
  toSQL(): string;
}

export type QueryConversionAllowedInputType = 
  | Record<string, string>;

export type SimpleNodeType = 
  | AttributeNodeInterface
  | EventNodeInterface
  | ValueNodeInterface;

export type ProcessableNodeType = 
  | ExpressionKind
  | ExpressionInterface
  // | ExpressionGroupInterface
  | SimpleNodeType;

export type QueryElement = ProcessableNodeType;