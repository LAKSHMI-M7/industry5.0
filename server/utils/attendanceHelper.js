const Attendance = require('../models/Attendance');

const checkAndFillMissedAttendance = async (userId, joinDate) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find the most recent attendance record
        const lastAttendance = await Attendance.findOne({ user: userId }).sort({ date: -1 });

        let startCheckDate;
        if (lastAttendance) {
            startCheckDate = new Date(lastAttendance.date);
        } else if (joinDate) {
            startCheckDate = new Date(joinDate);
            // If they joined today, don't start checking from before.
            // If they joined yesterday, we check yesterday.
        } else {
            return;
        }

        startCheckDate.setHours(0, 0, 0, 0);

        // Loop through gaps and fill as 'Absent'
        let checkDate = new Date(startCheckDate);
        if (lastAttendance) {
            checkDate.setDate(checkDate.getDate() + 1);
        }

        const missedRecords = [];

        while (checkDate < today) {
            missedRecords.push({
                user: userId,
                date: new Date(checkDate),
                status: 'Absent'
            });

            checkDate.setDate(checkDate.getDate() + 1);
        }

        if (missedRecords.length > 0) {
            // Use insertMany with ordered: false to skip duplicates
            await Attendance.insertMany(missedRecords, { ordered: false }).catch(() => { });
            console.log(`✅ Auto-marked ${missedRecords.length} days as Absent for user ${userId}`);
        }
    } catch (error) {
        console.error('❌ Error auto-filling attendance:', error);
    }
};

module.exports = checkAndFillMissedAttendance;
