module Plywood {
  export class SubstrAction extends Action {
    static fromJS(parameters: ActionJS): SubstrAction {
      var value = Action.jsToValue(parameters);
      value.position = parameters.position;
      value.length = parameters.length;
      return new SubstrAction(value);
    }

    public position: int;
    public length: int;

    constructor(parameters: ActionValue) {
      super(parameters, dummyObject);
      this.position = parameters.position;
      this.length = parameters.length;
      this._ensureAction("substr");
    }

    public getOutputType(inputType: string): string {
      this._checkInputType(inputType, 'STRING');
      return 'STRING';
    }

    public valueOf(): ActionValue {
      var value = super.valueOf();
      value.position = this.position;
      value.length = this.length;
      return value;
    }

    public toJS(): ActionJS {
      var js = super.toJS();
      js.position = this.position;
      js.length = this.length;
      return js;
    }

    protected _toStringParameters(expressionString: string): string[] {
      return [expressionString, String(this.position), String(this.length)];
    }

    public equals(other: SubstrAction): boolean {
      return super.equals(other) &&
        this.position === other.position &&
        this.length === other.length;
    }

    protected _getFnHelper(inputFn: ComputeFn): ComputeFn {
      const { position, length } = this;
      return (d: Datum, c: Datum) => {
        var inV = inputFn(d, c);
        if (inV === null) return null;
        return inV.substr(position, length);
      }
    }

    protected _getJSHelper(inputJS: string): string {
      const { position, length } = this;
      return `(''+${inputJS}).substr(${position},${length})`;
    }

    protected _getSQLHelper(dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
      return `SUBSTR(${inputSQL},${this.position + 1},${this.length})`;
    }
  }

  Action.register(SubstrAction);
}
