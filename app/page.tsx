"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Printer, FileText } from "lucide-react"

interface Poem {
  title: string
  author: string
  dynasty: string
  content: string
}

export default function PoetryFormatter() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [fileName, setFileName] = useState<string>("")

  const parsePoetryFile = (text: string): Poem[] => {
    const sections = text.split("--------------------------------------------------------------------------------")
    const parsedPoems: Poem[] = []

    for (const section of sections) {
      const lines = section
        .trim()
        .split("\n")
        .filter((line) => line.trim())
      if (lines.length < 2) continue

      const title = lines[0].trim()
      const authorLine = lines[1].trim()

      // 解析作者和朝代，格式：作者〔朝代〕
      const authorMatch = authorLine.match(/^(.+?)〔(.+?)〕$/)
      if (!authorMatch) continue

      const author = authorMatch[1].trim()
      const dynasty = authorMatch[2].trim()
      const content = lines.slice(2).join("\n").trim()

      parsedPoems.push({ title, author, dynasty, content })
    }

    return parsedPoems
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsedPoems = parsePoetryFile(text)
      setPoems(parsedPoems)
    }
    reader.readAsText(file, "UTF-8")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 上传界面 - 仅在屏幕显示，打印时隐藏 */}
      <div className="print:hidden">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 text-balance">古诗文排版工具</h1>
            <p className="text-muted-foreground">上传txt文件，自动生成三栏打印版本</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="default" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      选择txt文件
                    </span>
                  </Button>
                  <input id="file-upload" type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                </label>
                {fileName && <p className="mt-4 text-sm text-muted-foreground">已选择: {fileName}</p>}
              </div>

              {poems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">已解析 {poems.length} 首诗词</p>
                      <p className="text-sm text-muted-foreground">A4横向 · 三栏排版</p>
                    </div>
                    <Button onClick={handlePrint} size="lg">
                      <Printer className="w-4 h-4 mr-2" />
                      打印预览
                    </Button>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-medium text-amber-900 mb-2">打印提示</h3>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• 请在打印设置中选择"横向"方向</li>
                      <li>• 建议使用A4纸张</li>
                      <li>• 可以双面打印后对折装订</li>
                      <li>• 边距已优化，左侧留有装订空间</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">小册子制作建议</h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p className="font-medium">方案一：对折装订（推荐）</p>
                      <ul className="space-y-1 ml-4">
                        <li>• 打印多页后，从中间对折</li>
                        <li>• 对折后尺寸约为 A5（148mm × 210mm）</li>
                        <li>• 可以用订书机或线装订在折痕处</li>
                      </ul>
                      <p className="font-medium mt-3">方案二：裁剪装订</p>
                      <ul className="space-y-1 ml-4">
                        <li>• 打印后沿栏线裁剪成三条</li>
                        <li>• 每条尺寸约为 99mm × 210mm</li>
                        <li>• 多条叠放后装订成小册子</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 打印内容 - 仅在打印时显示 */}
      {poems.length > 0 && (
        <div className="hidden print:block print-content">
          {poems.map((poem, index) => (
            <article key={index} className="poem-item">
              <h2 className="poem-title">{poem.title}</h2>
              <div className="poem-meta">
                <span className="poem-dynasty">{poem.dynasty}</span>
                <span className="poem-separator">·</span>
                <span className="poem-author">{poem.author}</span>
              </div>
              <div className="poem-content">
                {poem.content.split("\n").map((line, i) => (
                  <p key={i} className="poem-line">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
