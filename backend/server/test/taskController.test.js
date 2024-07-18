const { expect } = require("chai");
const sinon = require("sinon");
const Task = require("../models/task");
const taskController = require("../controllers/taskController"); // Adjust the path as needed
var taskId = 0;
describe("Task Controller", () => {
  it("should return all tasks", async () => {
    const req = {};
    const res = {
      json: sinon.spy(),
    };
    const next = sinon.spy();

    const tasks = [{ description: "Task 1" }, { description: "Task 2" }];
    sinon.stub(Task, "find").resolves(tasks);

    await taskController.getAllTasks(req, res, next);

    expect(res.json.calledWith(tasks)).to.be.true;
    Task.find.restore();
  });

  it("should call next with an error when Task.find fails", async () => {
    const req = {};
    const res = {};
    const next = sinon.spy();

    const error = new Error("Test error");
    sinon.stub(Task, "find").rejects(error);

    await taskController.getAllTasks(req, res, next);

    expect(next.calledWith(error)).to.be.true;
    Task.find.restore();
  });
  it("should create a new task and return it", async () => {
    const req = {
      body: {
        description: "New Task",
        status: "open",
        dueDate: new Date(),
        priority: "high",
        assignedTo: "user1",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const task = new Task(req.body);
    sinon.stub(task, "save").resolves(task);
    sinon.stub(Task.prototype, "save").resolves(task);
    taskId = task._id;
    await taskController.createTask(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(task)).to.be.true;
    Task.prototype.save.restore();
  });

  it("should return 400 and error message when save fails", async () => {
    const req = {
      body: {
        description: "New Task",
        status: "open",
        dueDate: new Date(),
        priority: "high",
        assignedTo: "user1",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const error = new Error("Test error");
    sinon.stub(Task.prototype, "save").rejects(error);

    await taskController.createTask(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: error.message })).to.be.true;
    Task.prototype.save.restore();
  });

  it("should update the task and return it", async function () {
    this.timeout(15000);

    const req = {
      params: { id: "6697bafc36c6a06bcaa80e10" },
      body: {
        description: "Updated Task",
        status: "Not started",
        dueDate: new Date(),
        priority: "Low",
        assignedTo: "user1",
      },
    };
    const res = {
      json: sinon.spy(),
    };

    const task = new Task({
      _id: "6697bafc36c6a06bcaa80e10",
      description: "Updated Task",
      status: "Not started",
      dueDate: "24/6/2024",
      priority: "Low",
      assignedTo: "user1",
    });

    sinon.stub(Task, "findById").resolves(task);
    sinon.stub(Task.prototype, "save").resolves(task);

    await taskController.updateTask(req, res);

    expect(res.json.calledWith(task)).to.be.true;

    Task.findById.restore();
    Task.prototype.save.restore();
  });

  it("should return 404 when task is not found", async function () {
    const req = {
      params: { id: "6697bafc36c6a06bcaa80e11" },
      body: {
        description: "Updated Task",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  
    sinon.stub(Task, "findByIdAndUpdate").resolves(null);
  
    await taskController.updateTask(req, res);
  
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { message: "Task not found" });
  
    Task.findByIdAndUpdate.restore();
  });
  
  it("should return 400 and error message when update fails", async function () {
    const req = {
      params: { id: "6697bafc36c6a06bcaa80e11" },
      body: {
        description: "Updated Task",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  
    const error = new Error("Test error");
    sinon.stub(Task, "findByIdAndUpdate").rejects(error);
  
    await taskController.updateTask(req, res);
  
    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { message: error.message });
  
    Task.findByIdAndUpdate.restore();
  });
  

  it("should delete the task and return a success message", async () => {
    const req = {
      params: { id: taskId },
    };
    const res = {
      json: sinon.spy(),
    };
    const next = sinon.spy();

    const mockTask = {
      _id: taskId,
      deleteOne: sinon.stub().resolves(),
    };

    sinon.stub(Task, "findById").resolves(mockTask);

    await taskController.deleteTask(req, res, next);

    expect(res.json.calledWith({ message: "Task deleted" })).to.be.true;

    Task.findById.restore();
  });

  it("should return 404 when task is not found", async () => {
    const req = {
      params: { id: "task1" },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    sinon.stub(Task, "findById").resolves(null);

    await taskController.deleteTask(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Task not found" })).to.be.true;
    Task.findById.restore();
  });

  it("should call next with an error when delete fails", async () => {
    const req = {
      params: { id: "task1" },
    };
    const res = {};
    const next = sinon.spy();

    const error = new Error("Test error");
    sinon.stub(Task, "findById").rejects(error);

    await taskController.deleteTask(req, res, next);

    expect(next.calledWith(error)).to.be.true;
    Task.findById.restore();
  });
});
