import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { UserPlus, BriefcaseIcon, UserIcon, BarChartIcon, LogIn, LogOut, UserCircle } from 'lucide-react'

type Employee = {
  id: number
  name: string
  skills: string[]
}

type JobRole = {
  id: number
  title: string
  requiredSkills: string[]
}

type User = {
  username: string
  role: 'admin' | 'employee'
}

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "山田太郎", skills: ["プロジェクト管理", "リーダーシップ", "コミュニケーション"] },
    { id: 2, name: "佐藤花子", skills: ["データ分析", "プログラミング", "問題解決"] },
  ])
  const [jobRoles, setJobRoles] = useState<JobRole[]>([
    { id: 1, title: "プロジェクトマネージャー", requiredSkills: ["プロジェクト管理", "リーダーシップ", "コミュニケーション"] },
    { id: 2, title: "データサイエンティスト", requiredSkills: ["データ分析", "プログラミング", "統計学"] },
  ])

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [newEmployee, setNewEmployee] = useState({ name: '', skills: '' })
  const [newJobRole, setNewJobRole] = useState({ title: '', skills: '' })

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login')
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '' })
  const [resetForm, setResetForm] = useState({ email: '' })

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.skills) {
      setEmployees([...employees, {
        id: employees.length + 1,
        name: newEmployee.name,
        skills: newEmployee.skills.split(',').map(skill => skill.trim())
      }])
      setNewEmployee({ name: '', skills: '' })
    }
  }

  const addJobRole = () => {
    if (newJobRole.title && newJobRole.skills) {
      setJobRoles([...jobRoles, {
        id: jobRoles.length + 1,
        title: newJobRole.title,
        requiredSkills: newJobRole.skills.split(',').map(skill => skill.trim())
      }])
      setNewJobRole({ title: '', skills: '' })
    }
  }

  const calculateMatch = (employeeSkills: string[], jobSkills: string[]) => {
    const matchedSkills = employeeSkills.filter(skill => jobSkills.includes(skill))
    return (matchedSkills.length / jobSkills.length) * 100
  }

  const handleLogin = () => {
    if (loginForm.username && loginForm.password) {
      // 仮のユーザー認証ロジック (実際にはバックエンドで処理します)
      const role = loginForm.username === 'admin' ? 'admin' : 'employee'
      setCurrentUser({ username: loginForm.username, role })
      setLoginForm({ username: '', password: '' })
    }
  }

  const handleRegister = () => {
    if (registerForm.username && registerForm.password && registerForm.password === registerForm.confirmPassword) {
      // 仮の登録ロジック (実際にはバックエンドで処理します)
      setCurrentUser({ username: registerForm.username, role: 'employee' })
      setRegisterForm({ username: '', password: '', confirmPassword: '' })
    } else {
      alert('パスワードが一致しないか、必須フィールドが空です。')
    }
  }

  const handleResetPassword = () => {
    if (resetForm.email) {
      // 仮のパスワードリセットロジック (実際にはバックエンドで処理します)
      alert(`パスワードリセットリンクを ${resetForm.email} に送信しました。`)
      setResetForm({ email: '' })
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const canEdit = () => currentUser?.role === 'admin'

  const matchData = employees.map(employee => ({
    name: employee.name,
    ...jobRoles.reduce((acc, job) => ({
      ...acc,
      [job.title]: calculateMatch(employee.skills, job.requiredSkills)
    }), {})
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800">スキルマッチングダッシュボード</h1>
          {currentUser ? (
            <div className="flex items-center">
              <span className="mr-4">ようこそ、{currentUser.username}さん</span>
              <Button onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2" /> ログアウト
              </Button>
            </div>
          ) : (
            <Button onClick={() => setAuthMode('login')} className="flex items-center">
              <UserCircle className="mr-2" /> アカウント
            </Button>
          )}
        </div>

        {!currentUser && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register' | 'reset')}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="login">ログイン</TabsTrigger>
                  <TabsTrigger value="register">新規登録</TabsTrigger>
                  <TabsTrigger value="reset">パスワードリセット</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">ユーザー名</Label>
                      <Input
                        id="username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">パスワード</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleLogin} className="w-full">ログイン</Button>
                  </div>
                </TabsContent>
                <TabsContent value="register">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="register-username">ユーザー名</Label>
                      <Input
                        id="register-username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">パスワード</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">パスワード（確認）</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleRegister} className="w-full">登録</Button>
                  </div>
                </TabsContent>
                <TabsContent value="reset">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reset-email">メールアドレス</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetForm.email}
                        onChange={(e) => setResetForm({...resetForm, email: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleResetPassword} className="w-full">パスワードリセット</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {currentUser && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {canEdit() && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>従業員追加</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="employeeName">名前</Label>
                          <Input
                            id="employeeName"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeSkills">スキル（カンマ区切り）</Label>
                          <Input
                            id="employeeSkills"
                            value={newEmployee.skills}
                            onChange={(e) => setNewEmployee({...newEmployee, skills: e.target.value})}
                          />
                        </div>
                        <Button onClick={addEmployee}>追加</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>職種追加</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="jobTitle">職種名</Label>
                          <Input
                            id="jobTitle"
                            value={newJobRole.title}
                            onChange={(e) => setNewJobRole({...newJobRole, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobSkills">必要スキル（カンマ区切り）</Label>
                          <Input
                            id="jobSkills"
                            value={newJobRole.skills}
                            onChange={(e) => setNewJobRole({...newJobRole, skills: e.target.value})}
                          />
                        </div>
                        <Button onClick={addJobRole}>追加</Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">従業員スキル</h2>
              <div className="space-y-4">
                {employees.map(employee => (
                  <Card key={employee.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{employee.name}</span>
                      <div>
                        {employee.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="mr-1">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">職種別必要スキル</h2>
              <div className="space-y-4">
                {jobRoles.map(job => (
                  <Card key={job.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{job.title}</span>
                      <div>
                        {job.requiredSkills.map(skill => (
                          <Badge key={skill} variant="outline" className="mr-1">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">スキルマッチング結果</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={matchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {jobRoles.map(job => (
                    <Bar key={job.id} dataKey={job.title} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}