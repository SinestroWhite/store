'use strict'

const Review = use('App/Models/Review')

class ReviewController {
    async index({view}) {
        const reviews = await Review.query()
                .with('user')
                .with('product')
                .fetch();

        if (reviews.rows.length === 0) {
            return view.render('review.index')
        }
        return view.render('review.index', {reviews: reviews.rows})
    }

    async create({view}) {
        return view.render('review.create');
    }

    async store({ request, response, session, auth}) {
        const review = request.only(['comment', 'rating', 'user_id', 'product_id']);

        const posted = await auth.user.addresses().create({
            ...review
        });

        session.flash({ message: 'The review has been saved!', type: 'success' });
        return response.redirect('/reviews');
    }

    async edit({params, view}) {
        const review = await Review.find(params.id);
        return view.render('review.edit', { review });
    }

    async update({ response, request, session, params }) {
        const review = await Review.find(params.id);

        review.comment = request.all().comment;
        review.rating = request.all().rating;
        review.user_id = request.all().user_id;
        review.product_id = request.all().product_id;

        await review.save();

        session.flash({ message: 'The changes has been saved.', type: 'success'});
        return response.redirect('/reviews');
    }

    async destroy({ response, session, params}) {
        const review = await Review.find(params.id);

        await review.delete();
        session.flash({ message: 'The review has been removed.', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = ReviewController
