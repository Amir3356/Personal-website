import { authService } from "./authService";
import { experienceService } from "./experienceService";
import { projectService } from "./projectService";
import { techstackService } from "./techstackService";
import { messageService } from "./messageService";
import { settingsService } from "./settingsService";
import { uploadService } from "./uploadService";

export {
  authService,
  experienceService,
  projectService,
  techstackService,
  messageService,
  settingsService,
  uploadService,
};
export const api = {
  login: authService.login,
  me: authService.me,
  logout: authService.logout,

  getExperience: experienceService.list,
  createExperience: experienceService.create,
  updateExperience: experienceService.update,
  deleteExperience: experienceService.remove,

  getProjects: projectService.list,
  createProject: projectService.create,
  updateProject: projectService.update,
  deleteProject: projectService.remove,

  getTechstack: techstackService.list,
  createTechstack: techstackService.create,
  updateTechstack: techstackService.update,
  deleteTechstack: techstackService.remove,

  sendMessage: messageService.send,
  getMessages: messageService.list,
  markMessageRead: messageService.setRead,
  deleteMessage: messageService.remove,

  getSettings: settingsService.get,
  updateHero: settingsService.updateHero,
  updateExperienceSettings: settingsService.updateExperience,
  updateContact: settingsService.updateContact,

  upload: uploadService.upload,
};
