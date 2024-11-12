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

  Expression                        = 'Expression',
  ExpressionGroup                   = 'ExpressionGroup',
  BinaryExpression                  = 'BinaryExpression',

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
  | QuerySyntax.AttributeExpression
  | QuerySyntax.EventExpression
  | QuerySyntax.EmailExpression
  | QuerySyntax.MessageExpression
  | QuerySyntax.SMSExpression
  | QuerySyntax.PushExpression
  | QuerySyntax.SegmentExpression;

export type QueryMatchType = 
  | QuerySyntax.MatchingTypeAll
  | QuerySyntax.MatchingTypeAny;

export interface NodeInterface {
  readonly kind: QuerySyntax;
  readonly parent?: NodeInterface;
}

export interface ExpressionInterface extends NodeInterface {
  kind: ExpressionKind;
  operator: OperatorKind;
  left: NodeInterface;
  right: NodeInterface;
}

export interface ExpressionGroupInterface extends NodeInterface {
  kind: QuerySyntax.ExpressionGroup;
  elements: ExpressionInterface[];
  matching: QueryMatchType;

  add(expression: ExpressionInterface[]);
}

export interface EventExpressionInterface extends ExpressionInterface {
  kind: QuerySyntax.EventExpression;
  operator: EventOperatorKind;
  event: string;
  attributeExpressions?: ExpressionInterface[]
}

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

// export interface BinaryExpressionInterface extends ExpressionInterface {
//   kind: QuerySyntax.BinaryExpression;
//   left: ExpressionInterface;
//   right: ExpressionInterface;
//   operator: OperatorKind;
// }

export type QueryElement = 
  | ExpressionInterface
  | ExpressionGroupInterface;

export interface QueryBase {
  elements: readonly QueryElement[];
  matching: QueryMatchType;

  add(element: QueryElement);

  toSQL(): string;
}

// export interface AttributeExpression extends ExpressionInterface {
//   kind: QuerySyntax.AttributeExpression;
// }

// export interface EventExpression extends ExpressionInterface {
//   kind: QuerySyntax.EventExpression;
// }

// export interface MessageExpression extends ExpressionInterface {
//   kind: QuerySyntax.MessageExpression;
// }

