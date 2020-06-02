'use strict'

const Helpers = use('Helpers')
const Variation = use('App/Models/Variation')
const Image = use('App/Models/Image')
const Product = use('App/Models/Product')

class VariationController {

    async index({view, params}) {
        const product = (await Product.find(params.id)).id
        const variations = await Variation.query().where('product_id', '=', params.id).fetch()
        return view.render('product.new', { product, variations: variations.rows });
    }

    async store({request, view, session, response}) {
        const payload = request.only(['name', 'product_id'])
        const variation = await Variation.create(payload);

        const images = request.file('images', {
            multiple: true,
            types: ['image'],
            size: '2mb'
        })

        await images.moveAll(Helpers.tmpPath('uploads'), (file) => {
            return {
                name: `${new Date().getTime()}.${file.subtype}`
            };
        });

        if (!images.movedAll()) {
            session.flash({message: images.errors(), type: 'danger'});
            return response.redirect('back');
        }

        const files = images.movedList()

        await files.forEach((file) => {
            console.log(file)
            Image.create({
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
