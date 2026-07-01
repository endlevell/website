import { strict as assert } from 'node:assert';
import { getPublishedPosts, getProjects } from '../src/lib/db/queries';

const posts = await getPublishedPosts();
const projects = await getProjects();

assert(posts.length >= 3, 'expected seeded published posts');
assert(projects.length >= 3, 'expected seeded projects');
assert(posts.every((post) => post.published), 'RSS source must use published posts only');
assert(projects.every((project) => project.status !== 'archived'), 'sitemap source should exclude archived projects');

console.log('Feed data smoke test passed.');
