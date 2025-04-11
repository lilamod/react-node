const Job = require("../models/job");

const createJob = async (req, res, next) => {
    if (!req.body?.company) {
        return res.status(400).json({ message: "company name is required" })
    }
    if (!req.body?.status) {
        return res.status(400).json({ message: "status is required" })
    }
    if (!req.body?.link) {
        return res.status(400).json({ message: "link is required" })
    }
    if (!req.body?.role) {
        return res.status(400).json({ message: "role is required" })
    }

    const { company, status, link, role } = req.body;

    /**
     * This duplicate Application is use to check company and role is not duplicate
     */
    const duplicateApplication = await Job.findOne({ isDeleted: false, company: company, role: role });
    if (duplicateApplication) {
        return res.status(400).json({ message: "Company name and role is already exist" })
    }
    const user = new Job({
        company,
        status,
        link,
        role
    });
    await user.save()
        .then(() => {
            return res.status(200).json({ message: 'Job created successfully' });
        })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}

const updateJob = async (req, res, next) => {
    const jobDetails = await Job.findOne({ _id: req.params.id, isDeleted: false });
    if (!jobDetails) {
        return res.status(400).json({ message: "job details does not exist" });
    }
    let update = {};

    if (req.body.company) {
        update.company = req.body.company;
    };
    if (req.body.status) {
        update.status = req.body.status;
    }
    if (req.body.link) {
        update.link = req.body.link;
    }

    if (req.body.role) {
        update.role = req.body.role;
    }

    await Job.findByIdAndUpdate({ _id: req.params.id }, update)
        .then(() => {
            return res.status(200).json({ message: "job details update successfully" })
        })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}

const deleteJob = async (req, res, next) => {
    const jobDetails = await Job.findById({ _id: req.params.id, isDeleted: false });
    if (!jobDetails) {
        return res.status(400).json({ message: "job details does not exist" });
    }

    await Job.findByIdAndUpdate({ _id: req.params.id }, { isDeleted: true })
        .then(() => {
            return res.status(200).json({ message: "job details delete successfully" })
        })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}


/**
 * 
 * Sort the data on the basis of application date (latest come fisrt) using sort method
 */
const listOfJob = async (req, res, next) => {
    let where = {
        isDeleted: false,
        dateOfApplication: {}
    }

    if (req.body?.status) {
        where.status = req.body.status;
    };

    if (req.body?.fromDate) {
        where.dateOfApplication.$gt = new Date(req.body.fromDate + 'T00:00:00.000+05:30');
    }

    if (req.body?.toDate) {
        where.dateOfApplication.$lt = new Date(req.body.toDate + 'T23:59:59.000+05:30');
    }
    console.log(where)
    const count = await Job.countDocuments(where);
    const list = await Job.find(where).sort({ dateOfApplication: -1 });
    if (list.length > 0) {
        return res.status(200).json({ count, list });
    } else {
        return res.status(200).json({ count, list });
    }
}

/***
 * 
 * This is function is user to get count on the basis of status 
 */
const groupByStatus = async (req, res, next) => {
    Job.aggregate([
        {
            $match:
            {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $count: {} }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ]).exec().then((data) => {
        if (data.length > 0) {
            return res.status(200).json({ list: data });
        }
        return res.status(200).json({ list: 0 });
    })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}

const getJobById = async (req, res, next) => {
    const jobDetail = await Job.findById({ _id: req.params.id, isDeleted: false })
    if (jobDetail) {
        return res.status(200).json({ item: jobDetail })
    } else {
        return res.status(400).json({ message: "Job detail not found" })
    }
}


module.exports = {
    createJob, updateJob, deleteJob, listOfJob, groupByStatus, getJobById
}



