import Service from '../models/Service.js';

export const getServices = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        // Optional: Search functionality for later
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const services = await Service.find(query).populate('category', 'name icon');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('category', 'name icon');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
