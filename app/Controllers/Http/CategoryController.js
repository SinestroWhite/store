'use strict'

const Category = use('App/Models/Category')

class CategoryController {
    async index({view}) {
        const categories = await Category.all();
        if (categories.rows.length === 0) {
            return view.render('category.index')
        }
        return view.render('category.index', {categories: categories.rows})
    }

    async create({view}) {
        return view.render('category.create');
    }

    async store({request, response, session}) {
        let category = request.only(['name', 'description', 'is_active'])

        const posted = await Category.create({
            ...category
        });

        session.flash({message: 'The category has been created!', type: 'success'});
        return response.redirect('/categories');
    }

    async edit({params, view}) {
        const category = await Category.find(params.id);
        return view.render('category.edit', {category});
    }

    async update({response, request, session, params}) {
        const category = await Category.find(params.id);

        category.name = request.all().name;
        category.description = request.all().description;
        category.is_active = request.all().is_active;

        await category.save();

        session.flash({message: 'The category has been updated.', type: 'success'});
        return response.redirect('/categories');
    }

    async destroy({response, session, params}) {
        const category = await Category.find(params.id);

        await category.delete();
        session.flash({message: 'The category has been removed!', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = CategoryController
