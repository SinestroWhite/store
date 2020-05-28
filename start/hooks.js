const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {

    const Validator = use('Validator')
    const Database = use('Database')

    const existsFn = async (data, field, message, args, get) => {
        const value = get(data, field)
        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
             */
            return
        }

        const [table, column] = args
        const row = await Database.table(table).where(column, value).first()

        if (!row) {
            throw message
        }
    }
    Validator.extend('exists', existsFn)




    const View = use("View");
    function censor(censor) {
        let i = 0;

        return function(key, value) {
            if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
                return '[Circular]';

            if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
                return '[Unknown]';

            ++i; // so we know we aren't using the original object anymore

            return value;
        }
    }

    View.global("dd", function(obj) {
        console.log(obj);
        return JSON.stringify(censor(obj));
    });
});
