import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

// ファイルシステムからdateでソートした記事を取得する
export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '')

    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    return {
      id,
      ...(matterResult.data as { date: string, title: string })
    }
  })
  return allPostsData.sort((a,b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// ファイルシステムから記事のファイル名のリストを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const proceedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = proceedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string, title: string })
  }
}