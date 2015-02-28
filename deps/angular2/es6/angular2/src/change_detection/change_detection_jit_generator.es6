import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  BaseException,
  Type} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {ContextWithVariableBindings} from './parser/context_with_variable_bindings';
import {AbstractChangeDetector} from './abstract_change_detector';
import {ChangeDetectionUtil} from './change_detection_util';
import {ProtoRecord,
  RECORD_TYPE_SELF,
  RECORD_TYPE_PROPERTY,
  RECORD_TYPE_INVOKE_METHOD,
  RECORD_TYPE_CONST,
  RECORD_TYPE_INVOKE_CLOSURE,
  RECORD_TYPE_PRIMITIVE_OP,
  RECORD_TYPE_KEYED_ACCESS,
  RECORD_TYPE_PIPE,
  RECORD_TYPE_INTERPOLATE} from './proto_record';
var ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
var UTIL = "ChangeDetectionUtil";
var DISPATCHER_ACCESSOR = "this.dispatcher";
var PIPE_REGISTRY_ACCESSOR = "this.pipeRegistry";
var PROTOS_ACCESSOR = "this.protos";
var CHANGE_LOCAL = "change";
var CHANGES_LOCAL = "changes";
var TEMP_LOCAL = "temp";
function typeTemplate(type, cons, detectChanges, setContext) {
  assert.argumentTypes(type, assert.type.string, cons, assert.type.string, detectChanges, assert.type.string, setContext, assert.type.string);
  return assert.returnType((`
${cons}
${detectChanges}
${setContext};

return function(dispatcher, pipeRegistry) {
  return new ${type}(dispatcher, pipeRegistry, protos);
}
`), assert.type.string);
}
Object.defineProperty(typeTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
  }});
function constructorTemplate(type, fieldsDefinitions) {
  assert.argumentTypes(type, assert.type.string, fieldsDefinitions, assert.type.string);
  return assert.returnType((`
var ${type} = function ${type}(dispatcher, pipeRegistry, protos) {
${ABSTRACT_CHANGE_DETECTOR}.call(this);
${DISPATCHER_ACCESSOR} = dispatcher;
${PIPE_REGISTRY_ACCESSOR} = pipeRegistry;
${PROTOS_ACCESSOR} = protos;
${fieldsDefinitions}
}

${type}.prototype = Object.create(${ABSTRACT_CHANGE_DETECTOR}.prototype);
`), assert.type.string);
}
Object.defineProperty(constructorTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
function setContextTemplate(type) {
  assert.argumentTypes(type, assert.type.string);
  return assert.returnType((`
${type}.prototype.setContext = function(context) {
  this.context = context;
}
`), assert.type.string);
}
Object.defineProperty(setContextTemplate, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
function detectChangesTemplate(type, body) {
  assert.argumentTypes(type, assert.type.string, body, assert.type.string);
  return assert.returnType((`
${type}.prototype.detectChangesInRecords = function(throwOnChange) {
  ${body}
}
`), assert.type.string);
}
Object.defineProperty(detectChangesTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
function bodyTemplate(localDefinitions, changeDefinitions, records) {
  assert.argumentTypes(localDefinitions, assert.type.string, changeDefinitions, assert.type.string, records, assert.type.string);
  return assert.returnType((`
${localDefinitions}
${changeDefinitions}
var ${TEMP_LOCAL};
var ${CHANGE_LOCAL};
var ${CHANGES_LOCAL} = null;

context = this.context;
${records}
`), assert.type.string);
}
Object.defineProperty(bodyTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [assert.type.string]];
  }});
function notifyTemplate(index) {
  assert.argumentTypes(index, assert.type.number);
  return assert.returnType((`
if (${CHANGES_LOCAL} && ${CHANGES_LOCAL}.length > 0) {
  if(throwOnChange) ${UTIL}.throwOnChange(${PROTOS_ACCESSOR}[${index}], ${CHANGES_LOCAL}[0]);
  ${DISPATCHER_ACCESSOR}.onRecordChange(${PROTOS_ACCESSOR}[${index}].directiveMemento, ${CHANGES_LOCAL});
  ${CHANGES_LOCAL} = null;
}
`), assert.type.string);
}
Object.defineProperty(notifyTemplate, "parameters", {get: function() {
    return [[assert.type.number]];
  }});
function pipeCheckTemplate(context, pipe, pipeType, value, change, addRecord, notify) {
  assert.argumentTypes(context, assert.type.string, pipe, assert.type.string, pipeType, assert.type.string, value, assert.type.string, change, assert.type.string, addRecord, assert.type.string, notify, assert.type.string);
  return assert.returnType((`
if (${pipe} === ${UTIL}.unitialized() || !${pipe}.supports(${context})) {
  ${pipe} = ${PIPE_REGISTRY_ACCESSOR}.get('${pipeType}', ${context});
}

${CHANGE_LOCAL} = ${pipe}.transform(${context});
if (! ${UTIL}.noChangeMarker(${CHANGE_LOCAL})) {
  ${value} = ${CHANGE_LOCAL};
  ${change} = true;
  ${addRecord}
}
${notify}
`), assert.type.string);
}
Object.defineProperty(pipeCheckTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
  }});
function referenceCheckTemplate(assignment, newValue, oldValue, change, addRecord, notify) {
  return `
${assignment}
if (${newValue} !== ${oldValue} || (${newValue} !== ${newValue}) && (${oldValue} !== ${oldValue})) {
  ${change} = true;
  ${addRecord}
  ${oldValue} = ${newValue};
}
${notify}
`;
}
function assignmentTemplate(field, value) {
  assert.argumentTypes(field, assert.type.string, value, assert.type.string);
  return `${field} = ${value};`;
}
Object.defineProperty(assignmentTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
function propertyReadTemplate(name, context, newValue) {
  assert.argumentTypes(name, assert.type.string, context, assert.type.string, newValue, assert.type.string);
  return `
${TEMP_LOCAL} = ${UTIL}.findContext("${name}", ${context});
if (${TEMP_LOCAL} instanceof ContextWithVariableBindings) {
  ${newValue} = ${TEMP_LOCAL}.get('${name}');
} else {
  ${newValue} = ${TEMP_LOCAL}.${name};
}
`;
}
Object.defineProperty(propertyReadTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [assert.type.string]];
  }});
function invokeMethodTemplate(name, args, context, newValue) {
  assert.argumentTypes(name, assert.type.string, args, assert.type.string, context, assert.type.string, newValue, assert.type.string);
  return `
${TEMP_LOCAL} = ${UTIL}.findContext("${name}", ${context});
if (${TEMP_LOCAL} instanceof ContextWithVariableBindings) {
  ${newValue} = ${TEMP_LOCAL}.get('${name}').apply(null, [${args}]);
} else {
  ${newValue} = ${context}.${name}(${args});
}
`;
}
Object.defineProperty(invokeMethodTemplate, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], [assert.type.string], [assert.type.string]];
  }});
function localDefinitionsTemplate(names) {
  return assert.returnType((names.map((n) => `var ${n};`).join("\n")), assert.type.string);
}
Object.defineProperty(localDefinitionsTemplate, "parameters", {get: function() {
    return [[List]];
  }});
function changeDefinitionsTemplate(names) {
  return assert.returnType((names.map((n) => `var ${n} = false;`).join("\n")), assert.type.string);
}
Object.defineProperty(changeDefinitionsTemplate, "parameters", {get: function() {
    return [[List]];
  }});
function fieldDefinitionsTemplate(names) {
  return assert.returnType((names.map((n) => `${n} = ${UTIL}.unitialized();`).join("\n")), assert.type.string);
}
Object.defineProperty(fieldDefinitionsTemplate, "parameters", {get: function() {
    return [[List]];
  }});
function ifChangedGuardTemplate(changeNames, body) {
  assert.argumentTypes(changeNames, List, body, assert.type.string);
  var cond = changeNames.join(" || ");
  return assert.returnType((`
if (${cond}) {
  ${body}
}
`), assert.type.string);
}
Object.defineProperty(ifChangedGuardTemplate, "parameters", {get: function() {
    return [[List], [assert.type.string]];
  }});
function addSimpleChangeRecordTemplate(protoIndex, oldValue, newValue) {
  assert.argumentTypes(protoIndex, assert.type.number, oldValue, assert.type.string, newValue, assert.type.string);
  return `${CHANGES_LOCAL} = ${UTIL}.addRecord(${CHANGES_LOCAL},
    ${UTIL}.simpleChangeRecord(${PROTOS_ACCESSOR}[${protoIndex}].bindingMemento, ${oldValue}, ${newValue}));`;
}
Object.defineProperty(addSimpleChangeRecordTemplate, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.string], [assert.type.string]];
  }});
export class ChangeDetectorJITGenerator {
  constructor(typeName, records) {
    assert.argumentTypes(typeName, assert.type.string, records, assert.genericType(List, ProtoRecord));
    this.typeName = typeName;
    this.records = records;
    this.localNames = this.getLocalNames(records);
    this.changeNames = this.getChangeNames(this.localNames);
    this.fieldNames = this.getFieldNames(this.localNames);
    this.pipeNames = this.getPipeNames(this.localNames);
  }
  getLocalNames(records) {
    assert.argumentTypes(records, assert.genericType(List, ProtoRecord));
    var index = 0;
    var names = records.map((r) => {
      var sanitizedName = r.name.replace(new RegExp("\\W", "g"), '');
      return `${sanitizedName}${index++}`;
    });
    return assert.returnType((["context"].concat(names)), assert.genericType(List, String));
  }
  getChangeNames(localNames) {
    return assert.returnType((localNames.map((n) => `change_${n}`)), assert.genericType(List, String));
  }
  getFieldNames(localNames) {
    return assert.returnType((localNames.map((n) => `this.${n}`)), assert.genericType(List, String));
  }
  getPipeNames(localNames) {
    return assert.returnType((localNames.map((n) => `this.${n}_pipe`)), assert.genericType(List, String));
  }
  generate() {
    var text = typeTemplate(this.typeName, this.genConstructor(), this.genDetectChanges(), this.genSetContext());
    return assert.returnType((new Function('AbstractChangeDetector', 'ChangeDetectionUtil', 'ContextWithVariableBindings', 'protos', text)(AbstractChangeDetector, ChangeDetectionUtil, ContextWithVariableBindings, this.records)), Function);
  }
  genConstructor() {
    var fields = [];
    fields = fields.concat(this.fieldNames);
    this.records.forEach((r) => {
      if (r.mode === RECORD_TYPE_PIPE) {
        fields.push(this.pipeNames[r.selfIndex]);
      }
    });
    return assert.returnType((constructorTemplate(this.typeName, fieldDefinitionsTemplate(fields))), assert.type.string);
  }
  genSetContext() {
    return assert.returnType((setContextTemplate(this.typeName)), assert.type.string);
  }
  genDetectChanges() {
    var body = this.genBody();
    return assert.returnType((detectChangesTemplate(this.typeName, body)), assert.type.string);
  }
  genBody() {
    var rec = this.records.map((r) => this.genRecord(r)).join("\n");
    return assert.returnType((bodyTemplate(this.genLocalDefinitions(), this.genChangeDefinitions(), rec)), assert.type.string);
  }
  genLocalDefinitions() {
    return assert.returnType((localDefinitionsTemplate(this.localNames)), assert.type.string);
  }
  genChangeDefinitions() {
    return assert.returnType((changeDefinitionsTemplate(this.changeNames)), assert.type.string);
  }
  genRecord(r) {
    assert.argumentTypes(r, ProtoRecord);
    if (r.mode === RECORD_TYPE_PIPE) {
      return assert.returnType((this.genPipeCheck(r)), assert.type.string);
    } else {
      return assert.returnType((this.genReferenceCheck(r)), assert.type.string);
    }
  }
  genPipeCheck(r) {
    assert.argumentTypes(r, ProtoRecord);
    var context = this.localNames[r.contextIndex];
    var pipe = this.pipeNames[r.selfIndex];
    var newValue = this.localNames[r.selfIndex];
    var oldValue = this.fieldNames[r.selfIndex];
    var change = this.changeNames[r.selfIndex];
    var addRecord = addSimpleChangeRecordTemplate(r.selfIndex - 1, oldValue, newValue);
    var notify = this.genNotify(r);
    return assert.returnType((pipeCheckTemplate(context, pipe, r.name, newValue, change, addRecord, notify)), assert.type.string);
  }
  genReferenceCheck(r) {
    assert.argumentTypes(r, ProtoRecord);
    var newValue = this.localNames[r.selfIndex];
    var oldValue = this.fieldNames[r.selfIndex];
    var change = this.changeNames[r.selfIndex];
    var assignment = this.genUpdateCurrentValue(r);
    var addRecord = addSimpleChangeRecordTemplate(r.selfIndex - 1, oldValue, newValue);
    var notify = this.genNotify(r);
    var check = referenceCheckTemplate(assignment, newValue, oldValue, change, r.lastInBinding ? addRecord : '', notify);
    ;
    if (r.isPureFunction()) {
      return assert.returnType((this.ifChangedGuard(r, check)), assert.type.string);
    } else {
      return assert.returnType((check), assert.type.string);
    }
  }
  genUpdateCurrentValue(r) {
    assert.argumentTypes(r, ProtoRecord);
    var context = this.localNames[r.contextIndex];
    var newValue = this.localNames[r.selfIndex];
    var args = this.genArgs(r);
    switch (r.mode) {
      case RECORD_TYPE_SELF:
        return assert.returnType((assignmentTemplate(newValue, context)), assert.type.string);
      case RECORD_TYPE_CONST:
        return assert.returnType((`${newValue} = ${this.genLiteral(r.funcOrValue)}`), assert.type.string);
      case RECORD_TYPE_PROPERTY:
        if (r.contextIndex == 0) {
          return assert.returnType((propertyReadTemplate(r.name, context, newValue)), assert.type.string);
        } else {
          return assert.returnType((assignmentTemplate(newValue, `${context}.${r.name}`)), assert.type.string);
        }
      case RECORD_TYPE_INVOKE_METHOD:
        if (r.contextIndex == 0) {
          return assert.returnType((invokeMethodTemplate(r.name, args, context, newValue)), assert.type.string);
        } else {
          return assert.returnType((assignmentTemplate(newValue, `${context}.${r.name}(${args})`)), assert.type.string);
        }
      case RECORD_TYPE_INVOKE_CLOSURE:
        return assert.returnType((assignmentTemplate(newValue, `${context}(${args})`)), assert.type.string);
      case RECORD_TYPE_PRIMITIVE_OP:
        return assert.returnType((assignmentTemplate(newValue, `${UTIL}.${r.name}(${args})`)), assert.type.string);
      case RECORD_TYPE_INTERPOLATE:
        return assert.returnType((assignmentTemplate(newValue, this.genInterpolation(r))), assert.type.string);
      case RECORD_TYPE_KEYED_ACCESS:
        var key = this.localNames[r.args[0]];
        return assert.returnType((assignmentTemplate(newValue, `${context}[${key}]`)), assert.type.string);
      default:
        throw new BaseException(`Unknown operation ${r.mode}`);
    }
  }
  ifChangedGuard(r, body) {
    return assert.returnType((ifChangedGuardTemplate(r.args.map((a) => this.changeNames[a]), body)), assert.type.string);
  }
  genInterpolation(r) {
    assert.argumentTypes(r, ProtoRecord);
    var res = "";
    for (var i = 0; i < r.args.length; ++i) {
      res += this.genLiteral(r.fixedArgs[i]);
      res += " + ";
      res += this.localNames[r.args[i]];
      res += " + ";
    }
    res += this.genLiteral(r.fixedArgs[r.args.length]);
    return assert.returnType((res), assert.type.string);
  }
  genLiteral(value) {
    return assert.returnType((JSON.stringify(value)), assert.type.string);
  }
  genNotify(r) {
    return assert.returnType((r.lastInDirective ? notifyTemplate(r.selfIndex - 1) : ''), assert.type.string);
  }
  genArgs(r) {
    return assert.returnType((r.args.map((arg) => this.localNames[arg]).join(", ")), assert.type.string);
  }
}
Object.defineProperty(ChangeDetectorJITGenerator, "parameters", {get: function() {
    return [[assert.type.string], [assert.genericType(List, ProtoRecord)]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getLocalNames, "parameters", {get: function() {
    return [[assert.genericType(List, ProtoRecord)]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getChangeNames, "parameters", {get: function() {
    return [[assert.genericType(List, String)]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getFieldNames, "parameters", {get: function() {
    return [[assert.genericType(List, String)]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.getPipeNames, "parameters", {get: function() {
    return [[assert.genericType(List, String)]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genRecord, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genPipeCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genReferenceCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genUpdateCurrentValue, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.ifChangedGuard, "parameters", {get: function() {
    return [[ProtoRecord], [assert.type.string]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genInterpolation, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(ChangeDetectorJITGenerator.prototype.genArgs, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/src/change_detection/change_detection_jit_generator.map

//# sourceMappingURL=./change_detection_jit_generator.map