'use strict'

const Address = use('App/Models/Address')

class AddressController {
    async create({ request, response, session, auth}) {
        const address = request.only(['name', 'address', 'phone']);

        const posted = await auth.user.addresses().create({
            ...address
        });

        session.flash({ message: 'Your address has been added!', type: 'success' });
        return response.redirect('back');
    }

    async update({ response, request, session, params }) {
        const address = await Address.find(params.id);

        address.name = request.all().name;
        address.phone = request.all().phone;
        address.address = request.all().address;

        await address.save();

        session.flash({ message: 'Your address has been saved.', type: 'success'});
        return response.redirect('back');
    }

    async delete({ response, session, params}) {
        const address = await Address.find(params.id);

        await address.delete();
        session.flash({ message: 'The address has been removed.', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = AddressController
