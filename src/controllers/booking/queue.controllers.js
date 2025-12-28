import { paymentQueue } from "../../services/queue/queue.service.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";

// Get queue statistics
export const getQueueStats = asyncHandler(async (req, res) => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    paymentQueue.getWaitingCount(),
    paymentQueue.getActiveCount(),
    paymentQueue.getCompletedCount(),
    paymentQueue.getFailedCount(),
    paymentQueue.getDelayedCount()
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed
    }, "Queue statistics retrieved successfully")
  );
});

// Get all failed jobs
export const getFailedJobs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const failed = await paymentQueue.getFailed(0, parseInt(limit));
  
  const jobs = failed.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    failedReason: job.failedReason,
    stacktrace: job.stacktrace,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    attemptsMade: job.attemptsMade
  }));

  res.status(200).json(
    new ApiResponse(200, {
      count: jobs.length,
      jobs
    }, "Failed jobs retrieved successfully")
  );
});

// Get all active jobs
export const getActiveJobs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const active = await paymentQueue.getActive(0, parseInt(limit));
  
  const jobs = active.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    progress: job.progress()
  }));

  res.status(200).json(
    new ApiResponse(200, {
      count: jobs.length,
      jobs
    }, "Active jobs retrieved successfully")
  );
});

// Get all waiting jobs
export const getWaitingJobs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const waiting = await paymentQueue.getWaiting(0, parseInt(limit));
  
  const jobs = waiting.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    timestamp: job.timestamp
  }));

  res.status(200).json(
    new ApiResponse(200, {
      count: jobs.length,
      jobs
    }, "Waiting jobs retrieved successfully")
  );
});

// Get all completed jobs
export const getCompletedJobs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  
  const completed = await paymentQueue.getCompleted(0, parseInt(limit));
  
  const jobs = completed.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    returnvalue: job.returnvalue
  }));

  res.status(200).json(
    new ApiResponse(200, {
      count: jobs.length,
      jobs
    }, "Completed jobs retrieved successfully")
  );
});

// Retry a specific failed job
export const retryFailedJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const job = await paymentQueue.getJob(jobId);
  
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  await job.retry();

  res.status(200).json(
    new ApiResponse(200, { 
      jobId,
      jobName: job.name,
      data: job.data
    }, "Job retry initiated successfully")
  );
});

// Retry all failed jobs
export const retryAllFailedJobs = asyncHandler(async (req, res) => {
  const failed = await paymentQueue.getFailed();
  
  let retryCount = 0;
  for (const job of failed) {
    await job.retry();
    retryCount++;
  }

  res.status(200).json(
    new ApiResponse(200, { 
      retriedCount: retryCount 
    }, `${retryCount} failed jobs retried successfully`)
  );
});

// Remove a specific job
export const removeJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const job = await paymentQueue.getJob(jobId);
  
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  await job.remove();

  res.status(200).json(
    new ApiResponse(200, { jobId }, "Job removed successfully")
  );
});

// Clean completed/failed jobs
export const cleanQueue = asyncHandler(async (req, res) => {
  const { type, grace = 0 } = req.query; // type: completed, failed, delayed
  // grace: milliseconds (0 = all, 3600000 = older than 1 hour)

  let count = 0;

  switch (type) {
    case 'completed':
      count = await paymentQueue.clean(parseInt(grace), 'completed');
      break;
    case 'failed':
      count = await paymentQueue.clean(parseInt(grace), 'failed');
      break;
    case 'delayed':
      count = await paymentQueue.clean(parseInt(grace), 'delayed');
      break;
    default:
      throw new ApiError(400, "Invalid queue type. Use: completed, failed, or delayed");
  }

  res.status(200).json(
    new ApiResponse(200, { 
      cleaned: count,
      type 
    }, `${count} ${type} jobs cleaned successfully`)
  );
});

// Pause the queue
export const pauseQueue = asyncHandler(async (req, res) => {
  await paymentQueue.pause();

  res.status(200).json(
    new ApiResponse(200, null, "Queue paused successfully")
  );
});

// Resume the queue
export const resumeQueue = asyncHandler(async (req, res) => {
  await paymentQueue.resume();

  res.status(200).json(
    new ApiResponse(200, null, "Queue resumed successfully")
  );
});

// Get job by ID
export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const job = await paymentQueue.getJob(jobId);
  
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const jobData = {
    id: job.id,
    name: job.name,
    data: job.data,
    opts: job.opts,
    progress: job.progress(),
    delay: job.delay,
    timestamp: job.timestamp,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    stacktrace: job.stacktrace,
    returnvalue: job.returnvalue,
    finishedOn: job.finishedOn,
    processedOn: job.processedOn
  };

  res.status(200).json(
    new ApiResponse(200, jobData, "Job details retrieved successfully")
  );
});


export const emptyQueue = asyncHandler(async (req, res) => {
  await paymentQueue.empty();

  res.status(200).json(
    new ApiResponse(200, null, "Queue emptied successfully")
  );
});



export const getQueueHealth = asyncHandler(async (req, res) => {
  const [waiting, active, failed, delayed] = await Promise.all([
    paymentQueue.getWaitingCount(),
    paymentQueue.getActiveCount(),
    paymentQueue.getFailedCount(),
    paymentQueue.getDelayedCount()
  ]);

  const isPaused = await paymentQueue.isPaused();
  
  let status = 'healthy';
  const issues = [];

  if (isPaused) {
    status = 'paused';
    issues.push('Queue is paused');
  }

  if (failed > 100) {
    status = 'warning';
    issues.push(`High number of failed jobs: ${failed}`);
  }

  if (active > 1000) {
    status = 'warning';
    issues.push(`High number of active jobs: ${active}`);
  }

  res.status(200).json(
    new ApiResponse(200, {
      status,
      isPaused,
      waiting,
      active,
      failed,
      delayed,
      issues,
      timestamp: new Date()
    }, "Queue health status retrieved successfully")
  );
});