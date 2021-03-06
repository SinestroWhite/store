'use strict'

const Helpers = use('Helpers')
const Variation = use('App/Models/Variation')
const Image = use('App/Models/Image')
const Product = use('App/Models/Product')

class VariationController {

    makeid(length) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async index({view, params}) {
        const product = (await Product.find(params.id)).id
        const variations = await Variation.query().where('product_id', '=', params.id).fetch()
        return view.render('product.new', { product, variations: variations.rows });
    }

    async store({request, view, session, response}) {
        let payload = request.only(['name', 'product_id']);
        payload.id = await Variation.getMax('id') + 1;
        const variation = await Variation.create(payload);

        const images = request.file('images', {
            multiple: true,
            types: ['image'],
            size: '2mb'
        })

        await images.moveAll(Helpers.tmpPath('uploads'), (file) => {
            return {
                name: `${new Date().getTime()}${this.makeid(7)}.${file.subtype}`
            };
        });

        if (!images.movedAll()) {
            console.log(images.errors())
            session.flash({message: images.errors(), type: 'danger'});
            return response.redirect('back');
        }

        const files = images.movedList()

        const id = await Image.getMax('id') + 1;
        await files.forEach((file) => {
            Image.create({
                id: id,
                name: file.fileName,
                variation_id: variation.id
            })
        })

        const variations = await Variation.query().where('product_id', '=', payload.product_id).fetch()
        response.redirect('back', {variations: variations.rows, product: payload.product_id})
    }

    async showImage({params, response}) {
        response.implicitEnd = false
        response.download(Helpers.tmpPath('uploads/' + params.name))
    }

    async destroy({response, session, params}) {
        const variation = await Variation.find(params.id);

        await variation.images().delete();
        await variation.delete();
        session.flash({message: 'The variation has been removed!', type: 'success'});
        return response.redirect('back');
    }

}

module.exports = VariationController
