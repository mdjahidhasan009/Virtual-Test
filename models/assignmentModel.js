import mongoose from 'mongoose';

const assignmentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    mentor: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    submissions: [
      {
        file: {
          type: String
        },
        links: {
          type: Array
        },
        dateOfSubmission: {
          type: Date
        },
        username: {
          type: String,
          required: true
        },
        grades: [
          {
            mark: {
              type: Number
            },
            remarks: {
              type: String
            }
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
)

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
