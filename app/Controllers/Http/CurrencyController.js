'use strict'

const Currency = use('App/Models/Currency')

class CurrencyController {
    async index({view}) {
        const currencies = await Currency.all();
        if (currencies.rows.length === 0) {
            return view.render('currency.index')
        }
        return view.render('currency.index', {currencies: currencies.rows})
    }

    async create({view}) {
        return view.render('currency.create');
    }

    async store({request, response, session}) {
        let currency = request.only(['name', 'symbol', 'code', 'location', 'is_active'])

        const posted = await Currency.create({
            ...currency
        });

        session.flash({message: 'The currency has been added!', type: 'success'});
        return response.redirect('/currencies');
    }

    async edit({params, view}) {
        const currency = await Currency.find(params.id);
        return view.render('currency.edit', {currency});
    }

    async update({response, request, session, params}) {
        const currency = await Currency.find(params.id);

        currency.name = request.all().name;
        currency.symbol = request.all().symbol;
        currency.location = request.all().location;
        currency.code = request.all().code;
        currency.is_active = request.all().is_active;

        await currency.save();

        session.flash({message: 'The currency has been updated.', type: 'success'});
        return response.redirect('/currencies');
    }

    async destroy({response, session, params}) {
        const currency = await Currency.find(params.id);

        await currency.delete();
        session.flash({message: 'The currency has been removed!', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = CurrencyController
