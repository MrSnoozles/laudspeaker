export enum BaseStringOperators {
  Equal = ":x == ':value'",
  NotEqual = ":x <> ':value'",
  Contains = ":x LIKE '%:value%'",
  NotContains = ":x NOT LIKE '%:value%'",
}

export enum BaseNumberOperators {
  Equal = ":x == :value",
  NotEqual = ":x <> :value",
  LessThan = ":x < :value",
  LessThanOrEqual = ":x <= :value",
  GreaterThan = ":x > :value",
  GreaterThanOrEqual = ":x >= :value",
  Between = ":x >= :value1 AND :x <= :value2"
}

export enum BaseBooleanOperators {
  IsTrue = ":x IS True",
  IsFalse = ":x IS False",
}

export enum BaseDateOperators {
  After = BaseNumberOperators.GreaterThan,
  OnOrAfter = BaseNumberOperators.GreaterThanOrEqual,
  Before = BaseNumberOperators.LessThan,
  OnOrBefore = BaseNumberOperators.LessThanOrEqual,
  Between = BaseNumberOperators.Between,
}

export enum BaseArrayOperators {
  Empty = "cardinality(:x) == 0",
  NotEmpty = "cardinality(:x) > 0",
  LengthLessThan = "array_length(:x, 1) < :value",
  LengthGreaterThan = "array_length(:x, 1) > :value",
  LengthEqual = "array_length(:x, 1) == :value",
  Contains = "':value' = ANY(:x)",
  DoesNotContain = "':value' <> ANY(:x)",
}

export enum BaseObjectOperators {
  // KeyExist = ":x ? :key",
  // KeyDoesNotExist = "NOT( :x ? :key )",
  ValueEqual = BaseNumberOperators.Equal,
  ValueNotEqual = BaseNumberOperators.NotEqual,
}
