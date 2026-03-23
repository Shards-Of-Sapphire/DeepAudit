;; tools/queries/autodoc.scm
;; Captures Classes and their Docstrings
(class_definition
  name: (identifier) @class.name
  body: (block (expression_statement (string) @class.doc))?) @class.def

;; Captures Functions, Parameters, and Docstrings
(function_definition
  name: (identifier) @func.name
  parameters: (parameters) @func.params
  return_type: (type)? @func.return
  body: (block (expression_statement (string) @func.doc))?) @func.def