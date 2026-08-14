import { authService } from "./authService";
import { experienceService } from "./experienceService";
import { projectService } from "./projectService";
import { messageService } from "./messageService";
import { settingsService } from "./settingsService";
import { uploadService } from "./uploadService";

export {
  authService,
  experienceService,
  projectService,
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
