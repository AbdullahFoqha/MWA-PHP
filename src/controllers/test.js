const { model } = require("mongoose");
const mongoose = require("mongoose");

// const Grade = model(process.env.DB_MODEL_NAME);

const Anime = mongoose.model(process.env.ANIME_MODEL);
const ERROR_MESSAGE = process.env.CONTROLLER_GENERAL_ERR_MSG;

const get = (req, res) => {
  const { count, offset, error: paginationErrors } = _getPaginationData(req);
  const { studentId, courseId, error: filtersErrors } = _getStudentData(req);

  if (paginationErrors || filtersErrors) {
    return _sedResponse(res, {
      code: 400,
      data: "Count and Offset Should be a numbers..!",
    });
  }
  const builder = Grade.find();
  if (studentId) builder.or({ student_id: studentId });
  if (courseId) builder.or({ class_id: courseId });
  builder
    .skip(offset)
    .limit(count)
    .select({ student_id: 1, class_id: 1 })
    .then((grades) => {
      _sedResponse(res, { code: 200, data: grades });
    })
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

const getById = (req, res) => {
  const { gradeId } = _getIdFromReq(req);

  Grade.findById(gradeId)
    .then((grade) => {
      const response = { code: 200, data: grade };

      if (!grade) {
        response.code = 404;
        response.data = "Grade Not Found..!";
      } else {
        const homework = grade.scores.filter((s) => s.type === "homework");
        homework.sort((a, b) => a.score - b.score);
        grade.scores = [
          ...grade.scores.filter((s) => s.type !== "homework"),
          ...homework,
        ];
      }
      _sedResponse(res, response);
    })
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

const deleteById = (req, res) => {
  const { gradeId } = _getIdFromReq(req);

  console.log(gradeId);

  Grade.findByIdAndDelete(gradeId)
    .then((grade) => {
      const response = { code: 200, data: grade };

      if (!grade) {
        response.code = 404;
        response.data = "Grade Not Found..!";
      }

      _sedResponse(res, response);
    })
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

const create = (req, res) => {
  const gradeToInsert = { ...req.body };

  Grade.create(gradeToInsert)
    .then((grade) => _sedResponse(res, { code: 201, data: grade }))
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

const update = (req, res) => {
  const { gradeId } = _getIdFromReq(req);

  Grade.findByIdAndUpdate(
    gradeId,
    {
      $set: { ...req.body },
    },
    { new: true }
  )
    .then((grade) => {
      const response = { code: 200, data: grade };

      if (!grade) {
        response.code = 404;
        response.data = "Grade Not Found..!";
      }

      _sedResponse(res, response);
    })
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

const updatePart = (req, res) => {
  const { gradeId } = _getIdFromReq(req);

  Anime.findById(gradeId)
    .then((grade) => {
      const obj = { ...grade._doc, ...req.body };
      console.log(obj);
    })
    .catch((err) => {
      console.log(err);
      _sedResponse(res, { code: 500, data: ERROR_MESSAGE });
    });
};

//#region private

const _sedResponse = (res, response) => {
  res.status(response.code).json(response.data);
};

const _getPaginationData = (req) => {
  let count = process.env.COUNT;
  let offset = process.env.OFFSET;
  let error = false;

  if (req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }

  if (req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  if (isNaN(count) || isNaN(offset)) {
    error = true;
  }

  return {
    offset,
    count,
    error,
  };
};

const _getStudentData = (req) => {
  let studentId = undefined;
  let courseId = undefined;
  let error = false;

  if (req.query && req.query.studentId) {
    studentId = parseInt(req.query.studentId, 10);
  }

  if (req.query && req.query.courseId) {
    courseId = parseInt(req.query.courseId, 10);
  }

  if ((studentId && isNaN(studentId)) || (courseId && isNaN(courseId))) {
    error = true;
  }

  return {
    courseId,
    studentId,
    error,
  };
};

const _getIdFromReq = (req) => {
  let gradeId = undefined;

  if (req.params && req.params.gradeId) {
    gradeId = req.params.gradeId;
  }

  return {
    gradeId,
  };
};

//#endregion

module.exports = {
  getAll: get,
  getOne: getById,
  deleteOne: deleteById,
  addOne: create,
  fullUpdate: update,
  partialUpdate: updatePart,
};
