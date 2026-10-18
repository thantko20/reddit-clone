const fs = require('fs');
const http = require('http');
const path = require('path');
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} = require('@firebase/rules-unit-testing');
const {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  setLogLevel,
  updateDoc,
} = require('firebase/firestore');

setLogLevel('silent');

const PROJECT_ID = 'demo-reddit-clone';
const root = path.join(__dirname, '..');

const userDoc = (uid, username) => ({
  email: `${username}@example.com`,
  name: username,
  username,
  avatarURL: 'https://example.com/a.png',
  id: uid,
  createdAt: Date.now(),
});

const threadDoc = (id, authorId) => ({
  title: 'Hello',
  description: 'World',
  imageURL: '',
  upvotes: [authorId],
  downvotes: [],
  commentCounts: 0,
  voteCounts: 1,
  author: { name: 'alice', id: authorId },
  subreddit: { name: 'cats', id: 'sub1' },
  id,
  createdAt: Date.now(),
});

const commentDoc = (id, authorId, threadId) => ({
  author: {
    id: authorId,
    name: 'bob',
    avatarURL: 'https://example.com/a.png',
  },
  description: 'Nice',
  threadId,
  upvotes: [authorId],
  downvotes: [],
  createdAt: Date.now(),
  id,
  voteCounts: 1,
});

const subredditDoc = (id, ownerId, name) => ({
  name,
  members: [ownerId],
  createdAt: Date.now(),
  id,
  createdBy: ownerId,
});

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8'),
    },
    storage: {
      rules: fs.readFileSync(path.join(root, 'storage.rules'), 'utf8'),
    },
  });

  const failures = [];

  const check = async (name, fn) => {
    try {
      await fn();
      console.log(`ok  ${name}`);
    } catch (err) {
      console.error(`FAIL ${name}`);
      console.error(err);
      failures.push(name);
    }
  };

  const alice = () => testEnv.authenticatedContext('alice').firestore();
  const bob = () => testEnv.authenticatedContext('bob').firestore();
  const anon = () => testEnv.unauthenticatedContext().firestore();

  try {
    await check('signed-out user cannot read a profile', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users/alice'), userDoc('alice', 'alice'));
      });
      await assertFails(getDoc(doc(anon(), 'users/alice')));
    });

    await check('another member cannot read a profile', async () => {
      await assertFails(getDoc(doc(bob(), 'users/alice')));
    });

    await check('owner can read their profile', async () => {
      await assertSucceeds(getDoc(doc(alice(), 'users/alice')));
    });

    await check('profiles cannot be listed', async () => {
      await assertFails(getDocs(collection(alice(), 'users')));
      await assertFails(getDocs(collection(anon(), 'users')));
    });

    await check('username availability can be checked without auth', async () => {
      await assertSucceeds(getDoc(doc(anon(), 'usernames/freshname')));
    });

    await check('usernames cannot be listed', async () => {
      await assertFails(getDocs(collection(anon(), 'usernames')));
      await assertFails(getDocs(collection(alice(), 'usernames')));
    });

    await check('a user can claim only their own username', async () => {
      await assertSucceeds(setDoc(doc(alice(), 'usernames/alice'), { uid: 'alice' }));
      await assertFails(setDoc(doc(bob(), 'usernames/bob'), { uid: 'alice' }));
      await assertFails(setDoc(doc(bob(), 'usernames/alice'), { uid: 'bob' }));
    });

    await check('profile create is limited to yourself', async () => {
      await assertFails(setDoc(doc(bob(), 'users/alice'), userDoc('alice', 'alice')));
      await assertSucceeds(setDoc(doc(bob(), 'users/bob'), userDoc('bob', 'bob')));
    });

    await check('signed-out clients cannot read threads or subreddits', async () => {
      await assertFails(getDocs(collection(anon(), 'threads')));
      await assertFails(getDocs(collection(anon(), 'subreddits')));
      await assertFails(getDocs(collection(anon(), 'comments')));
    });

    await check('creating a community requires you as the only member', async () => {
      await assertSucceeds(
        setDoc(doc(alice(), 'subreddits/sub1'), subredditDoc('sub1', 'alice', 'cats')),
      );
      await assertFails(
        setDoc(doc(bob(), 'subreddits/bad'), {
          ...subredditDoc('bad', 'alice', 'dogs'),
          createdBy: 'bob',
          members: ['alice'],
        }),
      );
      await assertFails(
        setDoc(doc(alice(), 'subreddits/hyphen'), subredditDoc('hyphen', 'alice', 'has-hyphen')),
      );
    });

    await check('join and leave only add or remove your own uid', async () => {
      await assertSucceeds(
        updateDoc(doc(bob(), 'subreddits/sub1'), { members: arrayUnion('bob') }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'subreddits/sub1'), { name: 'renamed' }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'subreddits/sub1'), { members: arrayUnion('carol') }),
      );
      await assertSucceeds(
        updateDoc(doc(bob(), 'subreddits/sub1'), { members: arrayRemove('bob') }),
      );
    });

    await check('a legacy community without createdBy can still be joined', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'subreddits/legacy'), {
          name: 'legacy',
          members: ['alice'],
          createdAt: Date.now(),
          id: 'legacy',
        });
      });
      await assertSucceeds(
        updateDoc(doc(bob(), 'subreddits/legacy'), { members: arrayUnion('bob') }),
      );
      await assertFails(deleteDoc(doc(alice(), 'subreddits/legacy')));
    });

    await check('the creator can delete a new community', async () => {
      await assertFails(deleteDoc(doc(bob(), 'subreddits/sub1')));
      await assertSucceeds(deleteDoc(doc(alice(), 'subreddits/sub1')));
    });

    await check('threads are created as yourself and only the author can delete', async () => {
      await assertSucceeds(setDoc(doc(alice(), 'threads/t1'), threadDoc('t1', 'alice')));
      await assertFails(
        setDoc(doc(bob(), 'threads/t2'), {
          ...threadDoc('t2', 'alice'),
          author: { name: 'alice', id: 'alice' },
          upvotes: ['alice'],
        }),
      );
      await assertSucceeds(getDoc(doc(bob(), 'threads/t1')));
      await assertFails(deleteDoc(doc(bob(), 'threads/t1')));
      await assertSucceeds(deleteDoc(doc(alice(), 'threads/t1')));
    });

    await check('votes can only add or remove your own uid', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'threads/t1'), threadDoc('t1', 'alice'));
      });

      await assertSucceeds(
        updateDoc(doc(bob(), 'threads/t1'), {
          upvotes: arrayUnion('bob'),
          downvotes: arrayRemove('bob'),
        }),
      );
      await assertSucceeds(
        updateDoc(doc(bob(), 'threads/t1'), { voteCounts: 2 }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'threads/t1'), { title: 'hijacked' }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'threads/t1'), { upvotes: arrayUnion('carol') }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'threads/t1'), { voteCounts: 100 }),
      );

      await assertSucceeds(
        updateDoc(doc(bob(), 'threads/t1'), {
          upvotes: arrayRemove('bob'),
          downvotes: arrayUnion('bob'),
        }),
      );
      await assertSucceeds(
        updateDoc(doc(bob(), 'threads/t1'), { voteCounts: 0 }),
      );
    });

    await check('comments follow the same author and vote rules', async () => {
      await assertSucceeds(
        setDoc(doc(bob(), 'comments/c1'), commentDoc('c1', 'bob', 't1')),
      );
      await assertSucceeds(
        updateDoc(doc(bob(), 'threads/t1'), { commentCounts: increment(1) }),
      );
      await assertFails(
        updateDoc(doc(bob(), 'threads/t1'), { commentCounts: increment(2) }),
      );
      await assertFails(deleteDoc(doc(alice(), 'comments/c1')));
      await assertSucceeds(deleteDoc(doc(bob(), 'comments/c1')));
    });

    await check('storage writes require auth, an image type, and the size cap', async () => {
      // The JS SDK's resumable upload hangs against this emulator, so hit the
      // same rules runtime over the emulator's multipart HTTP API.
      const storage = testEnv.emulators.storage;
      if (!storage) throw new Error('Storage emulator was not discovered');

      const upload = ({ uid, name, contentType, size }) => {
        const boundary = 'ruleboundary';
        const meta = JSON.stringify({ name, contentType });
        const data = Buffer.alloc(size, 1);
        const body = Buffer.concat([
          Buffer.from(
            `--${boundary}\r\nContent-Type: application/json\r\n\r\n${meta}\r\n`,
          ),
          Buffer.from(`--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`),
          data,
          Buffer.from(`\r\n--${boundary}--`),
        ]);
        const header = Buffer.from(
          JSON.stringify({ alg: 'none', typ: 'JWT' }),
        ).toString('base64url');
        const payload = Buffer.from(
          JSON.stringify({ user_id: uid, sub: uid }),
        ).toString('base64url');

        return new Promise((resolve, reject) => {
          const req = http.request(
            {
              host: storage.host,
              port: storage.port,
              method: 'POST',
              path:
                '/v0/b/demo-reddit-clone.appspot.com/o?name=' +
                encodeURIComponent(name),
              headers: {
                'Content-Type': `multipart/related; boundary=${boundary}`,
                'Content-Length': body.length,
                'x-goog-upload-protocol': 'multipart',
                ...(uid ? { Authorization: `Bearer ${header}.${payload}.x` } : {}),
              },
            },
            (res) => {
              const chunks = [];
              res.on('data', (chunk) => chunks.push(chunk));
              res.on('end', () =>
                resolve({
                  status: res.statusCode,
                  body: Buffer.concat(chunks).toString('utf8'),
                }),
              );
            },
          );
          req.on('error', reject);
          req.write(body);
          req.end();
        });
      };

      const expectStatus = async (status, options) => {
        const result = await upload(options);
        if (result.status !== status) {
          throw new Error(
            `expected HTTP ${status} for ${options.name} but got ${result.status}: ${result.body}`,
          );
        }
      };

      await expectStatus(403, {
        name: 'avatars/anon.png',
        contentType: 'image/png',
        size: 4,
      });
      await expectStatus(200, {
        uid: 'alice',
        name: 'avatars/ok.png',
        contentType: 'image/png',
        size: 4,
      });
      await expectStatus(403, {
        uid: 'alice',
        name: 'avatars/notes.txt',
        contentType: 'text/plain',
        size: 4,
      });
      await expectStatus(403, {
        uid: 'alice',
        name: 'avatars/big.png',
        contentType: 'image/png',
        size: 1024 * 1024 + 1,
      });
      await expectStatus(200, {
        uid: 'alice',
        name: 'thread_images/wide.jpg',
        contentType: 'image/jpeg',
        size: 1024 * 1024 + 1,
      });
      await expectStatus(403, {
        uid: 'alice',
        name: 'thread_images/too-wide.jpg',
        contentType: 'image/jpeg',
        size: 2 * 1024 * 1024 + 1,
      });
    });
  } finally {
    await testEnv.cleanup();
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} rules test(s) failed`);
    process.exit(1);
  }

  console.log('\nAll rules tests passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
