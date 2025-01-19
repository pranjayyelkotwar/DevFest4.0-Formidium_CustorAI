export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      emails: {
        Row: {
          email_id: string
          subject: string
          sender: string
          received_at: string
          processed_at: string | null
          processing_status: string
          raw_content: string | null
          junk: boolean
          product_issue: boolean
          personal_issue: boolean
          delivery_issue: boolean
          payment_issue: boolean
          priority: number
        }
        Insert: {
          email_id: string
          subject: string
          sender: string
          received_at?: string
          processed_at?: string | null
          processing_status?: string
          raw_content?: string | null
          junk?: boolean
          product_issue?: boolean
          personal_issue?: boolean
          delivery_issue?: boolean
          payment_issue?: boolean
          priority?: number
        }
        Update: {
          email_id?: string
          subject?: string
          sender?: string
          received_at?: string
          processed_at?: string | null
          processing_status?: string
          raw_content?: string | null
          junk?: boolean
          product_issue?: boolean
          personal_issue?: boolean
          delivery_issue?: boolean
          payment_issue?: boolean
          priority?: number
        }
      }
    }
  }
}