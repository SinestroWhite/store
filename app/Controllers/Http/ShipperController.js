'use strict'

const Shipper = use('App/Models/Shipper');

class ShipperController {
    async index({view}) {
        const shippers = await Shipper.all();
        if (shippers.rows.length === 0) {
            return view.render('shipper.index')
        }
        return view.render('shipper.index', {shippers: shippers.rows})
    }

    async create({view}) {
        return view.render('shipper.create');
    }

    async store({request, response, session}) {
        let shipper = request.only(['name', 'description'])

        const posted = await Shipper.create({
            ...shipper
        });

        session.flash({message: 'The shipper has been added!', type: 'success'});
        return response.redirect('/shippers');
    }

    async edit({params, view}) {
        const shipper = await Shipper.find(params.id);
        return view.render('shipper.edit', { shipper });
    }

    async update({response, request, session, params}) {
        const shipper = await Shipper.find(params.id);

        shipper.name = request.all().name;
        shipper.description = request.all().description;

        await shipper.save();

        session.flash({message: 'The shipper has been updated.', type: 'success'});
        return response.redirect('/shippers');
    }

    async destroy({response, session, params}) {
        const shipper = await Shipper.find(params.id);

        await shipper.delete();
        session.flash({message: 'The shipper has been removed!', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = ShipperController
