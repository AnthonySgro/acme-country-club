const { Sequelize, DataTypes, Model } = require("sequelize");
const database = new Sequelize(
    process.env.DATABASE_URL || "postgres://localhost/acme_country_club",
    {
        logging: false,
    },
);

class Facility extends Model {}
class Member extends Model {}
class Booking extends Model {}
class MemberBookings extends Model {}

Facility.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        fac_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        sequelize: database,
        modelName: "facilities",
    },
);

Member.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        first_name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        sequelize: database,
        modelName: "members",
    },
);

Booking.init(
    {
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        sequelize: database,
        modelName: "bookings",
    },
);

MemberBookings.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        timestamps: false,
        sequelize: database,
        modelName: "member_bookings",
    },
);

Booking.belongsTo(Member, { as: "bookedBy" });
Member.belongsToMany(Booking, {
    through: MemberBookings,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
});

Booking.belongsTo(Facility, {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
});
Facility.hasMany(Booking, {
    type: DataTypes.UUID,
});

Member.belongsTo(Member, {
    as: "sponsor",
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
});

Booking.newBooking = async (info) => {
    try {
        const newBooking = await Booking.create({
            startTime: info[0],
            endTime: info[1],
            bookedById: info[2],
            facilityId: info[3],
        });
        return newBooking;
    } catch (err) {
        console.log(err);
    }
};

const syncAndSeed = async () => {
    try {
        await Promise.all(
            ["YMCA", "Equinox", "Planet Fitness"].map((facilityName) => {
                Facility.create({ fac_name: facilityName });
            }),
        );

        await Promise.all(
            [
                "Anthony",
                "Tom",
                "Kevin",
                "Nava",
                "Clare",
                "Emily",
                "Tamanna",
            ].map((memberName) => {
                Member.create({ first_name: memberName });
            }),
        );
    } catch (err) {
        console.log(err);
    }
};

const init = async () => {
    try {
        await database.sync({ force: true });
        console.log("Database Connected!");
        await syncAndSeed();
    } catch (err) {
        console.log(err);
    }
};

init();

module.exports = {
    init,
    database,
    models: {
        Facility,
        Member,
        Booking,
        MemberBookings,
    },
};
