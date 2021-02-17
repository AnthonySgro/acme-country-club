const express = require("express");
const app = express();
const PORT = 3000;
const { init, database, models } = require("./database");

const seedMore = async () => {
    try {
        const anthony = await models.Member.findOne({
            where: {
                first_name: "Anthony",
            },
        });

        const kevin = await models.Member.findOne({
            where: {
                first_name: "Kevin",
            },
        });

        const tom = await models.Member.findOne({
            where: {
                first_name: "Tom",
            },
        });

        const nava = await models.Member.findOne({
            where: {
                first_name: "Nava",
            },
        });

        const clare = await models.Member.findOne({
            where: {
                first_name: "Clare",
            },
        });

        const emily = await models.Member.findOne({
            where: {
                first_name: "Emily",
            },
        });

        const tamanna = await models.Member.findOne({
            where: {
                first_name: "Tamanna",
            },
        });

        anthony.sponsorId = kevin.id;
        tom.sponsorId = kevin.id;
        nava.sponsorId = kevin.id;
        emily.sponsorId = clare.id;
        tamanna.sponsorId = clare.id;

        anthony.save();
        kevin.save();
        tom.save();
        nava.save();
        clare.save();
        emily.save();
        tamanna.save();

        const planetFitness = await models.Facility.findOne({
            where: {
                fac_name: "Planet Fitness",
            },
        });

        const equinox = await models.Facility.findOne({
            where: {
                fac_name: "Equinox",
            },
        });

        const ymca = await models.Facility.findOne({
            where: {
                fac_name: "YMCA",
            },
        });

        await models.Booking.newBooking([
            "2021-01-05 12:00:00",
            "2021-01-05 14:00:00",
            anthony.id,
            ymca.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-06 12:00:00",
            "2021-01-06 14:00:00",
            kevin.id,
            ymca.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-05 17:00:00",
            "2021-01-05 18:00:00",
            clare.id,
            equinox.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-06 17:00:00",
            "2021-01-06 19:00:00",
            tamanna.id,
            planetFitness.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-08 12:00:00",
            "2021-01-08 14:00:00",
            clare.id,
            ymca.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-09 12:00:00",
            "2021-01-09 14:00:00",
            nava.id,
            ymca.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-07 13:00:00",
            "2021-01-05 14:00:00",
            tom.id,
            equinox.id,
        ]);

        await models.Booking.newBooking([
            "2021-01-06 18:00:00",
            "2021-01-06 19:00:00",
            kevin.id,
            planetFitness.id,
        ]);
    } catch (err) {
        console.log(err);
    }
};

app.get("/api/facilities", async (req, res, next) => {
    await seedMore();

    res.send(
        await models.Facility.findAll({
            include: models.Booking,
        }),
    );
});

app.get("/api/bookings", async (req, res, next) => {
    await seedMore();

    res.send(
        await models.Booking.findAll({
            include: {
                model: models.Member,
                as: "bookedBy",
            },
        }),
    );
});

app.get("/api/members", async (req, res, next) => {
    await seedMore();

    res.send(
        await models.Member.findAll({
            include: {
                model: models.Member,
                as: "sponsor",
            },
        }),
    );
});

app.listen(PORT, () => {
    console.log("App listening!");
});
