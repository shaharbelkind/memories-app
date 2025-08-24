"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const story_1 = require("../types/story");
const child_1 = require("../types/child");
let StoryResolver = class StoryResolver {
    async stories(childId, type) {
        const stories = [
            {
                id: '1',
                childId: 'c1',
                type: story_1.StoryType.ANNUAL_FILM,
                title: 'Emma\'s 2024 Year in Review',
                status: story_1.StoryStatus.COMPLETED,
                year: 2024,
                duration: 120,
                url: 'https://example.com/stories/1.mp4',
                createdAt: '2024-12-31T00:00:00Z',
            },
            {
                id: '2',
                childId: 'c2',
                type: story_1.StoryType.STORYBOOK,
                title: 'Leo\'s First Steps Story',
                status: story_1.StoryStatus.COMPLETED,
                url: 'https://example.com/stories/2.pdf',
                createdAt: '2024-02-20T00:00:00Z',
            },
        ];
        return stories.filter(s => (!childId || s.childId === childId) &&
            (!type || s.type === type));
    }
    async story(id) {
        const stories = await this.stories();
        return stories.find(s => s.id === id) || null;
    }
    async generateStory(input) {
        const story = {
            id: Date.now().toString(),
            ...input,
            status: story_1.StoryStatus.PROCESSING,
            createdAt: new Date().toISOString(),
        };
        // TODO: Enqueue story generation job
        // await storyQueue.add('generate', { ...input, storyId: story.id });
        return story;
    }
    async child(story) {
        return {
            id: story.childId,
            name: story.childId === 'c1' ? 'Emma' : 'Leo',
            dob: '2019-01-01',
            createdAt: '2019-01-01T00:00:00Z',
            updatedAt: '2019-01-01T00:00:00Z',
        };
    }
};
exports.StoryResolver = StoryResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [story_1.Story]),
    __param(0, (0, type_graphql_1.Arg)('childId')),
    __param(1, (0, type_graphql_1.Arg)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoryResolver.prototype, "stories", null);
__decorate([
    (0, type_graphql_1.Query)(() => story_1.Story, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoryResolver.prototype, "story", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => story_1.Story),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof story_1.GenerateStoryInput !== "undefined" && story_1.GenerateStoryInput) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], StoryResolver.prototype, "generateStory", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => child_1.Child),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof story_1.Story !== "undefined" && story_1.Story) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], StoryResolver.prototype, "child", null);
exports.StoryResolver = StoryResolver = __decorate([
    (0, type_graphql_1.Resolver)(story_1.Story)
], StoryResolver);
